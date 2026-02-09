const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Load models
const User = require('../models/userModel');
// const Client = require('../models/clientModel');
const Product = require('../models/productModel');
const Invoice = require('../models/invoiceModel');
const Counter = require('../models/invoiceModel').Counter;

// --- DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for migration...');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

// --- DATA READING ---
const readJSON = (filePath) => {
    const data = fs.readFileSync(path.join(__dirname, filePath), 'utf-8');
    return JSON.parse(data);
};

// --- DATA MIGRATION LOGIC ---

// Maps to hold old_id -> new_id relationships
const userMap = new Map();
const clientMap = new Map();
const productMap = new Map();

const migrateUsers = async () => {
    console.log('Migrating users...');
    const users = readJSON('data/base44_users.json');
    for (const u of users) {
        const [firstName, lastName] = u.full_name.split(' ');
        const newUser = new User({
            firstName,
            lastName,
            email: u.email,
            role: u.access_level,
            password: 'defaultPassword123' // Set a default password
        });
        const savedUser = await newUser.save();
        userMap.set(u.id, savedUser._id);
    }
    console.log(`Migrated ${userMap.size} users.`);
};

const migrateProducts = async () => {
    console.log('Migrating products...');
    const products = readJSON('data/base44_products.json');
    for (const p of products) {
        const newProduct = new Product({
            name: p.product_name,
            price: p.unit_cost,
            unit: p.unit_type
        });
        const savedProduct = await newProduct.save();
        productMap.set(p.sku, savedProduct._id);
    }
    console.log(`Migrated ${productMap.size} products.`);
};

const migrateClients = async () => {
    console.log('Migrating clients...');
    const clients = readJSON('data/base44_clients.json');
    for (const c of clients) {
        const newClient = new Client({
            companyName: c.company_name,
            contactName: c.contact,
            email: c.email_address,
            status: c.status,
            managedBy: userMap.get(c.manager_id) // Using the map to link users
        });
        const savedClient = await newClient.save();
        clientMap.set(c.id, savedClient._id);
    }
    console.log(`Migrated ${clientMap.size} clients.`);
};

const migrateInvoices = async () => {
    console.log('Migrating invoices...');
    const invoices = readJSON('data/base44_invoices.json');
    let count = 0;
    for (const i of invoices) {
        const lineItems = i.line_items.map(item => ({
            productId: productMap.get(item.product_ref),
            description: item.description,
            quantity: item.qty,
            unitPrice: item.price_per_unit,
            totalPrice: item.qty * item.price_per_unit,
        }));

        const newInvoice = new Invoice({
            client: clientMap.get(i.customer_id), // Using the map
            issueDate: new Date(i.issued),
            dueDate: new Date(i.due),
            status: i.state,
            lineItems: lineItems,
        });
        await newInvoice.save();
        count++;
    }
    console.log(`Migrated ${count} invoices.`);
};


const clearDatabase = async () => {
    console.log('Clearing database...');
    // The 'deleteOne' hook on Client will cascade to Invoices
    await User.deleteMany();
    await Client.deleteMany();
    await Product.deleteMany();
    await Invoice.deleteMany();
    // Also reset the invoice counter
    await mongoose.connection.collection('counters').deleteMany({});
    console.log('Database cleared.');
};

// --- MAIN ORCHESTRATOR ---
const main = async () => {
    await connectDB();

    if (process.argv.includes('--clean')) {
        await clearDatabase();
    }

    try {
        console.time('Migration took');
        await migrateUsers();
        await migrateProducts();
        await migrateClients();
        await migrateInvoices();
        console.timeEnd('Migration took');
        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        mongoose.disconnect();
    }
};

main();
