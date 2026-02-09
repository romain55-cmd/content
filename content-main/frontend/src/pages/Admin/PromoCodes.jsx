import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/components/ui/use-toast";
import { getPromoCodes, createPromoCode } from '../../api/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const promoCodeSchema = z.object({
  code: z.string().min(1, 'Код обязателен'),
  discountType: z.enum(['percentage', 'fixed_amount']),
  discountValue: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Значение должно быть положительным')
  ),
  expiresAt: z.string().optional(),
});

const PromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: '',
      discountType: 'percentage',
      discountValue: '',
      expiresAt: '',
    },
  });

  const fetchPromoCodes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPromoCodes();
      setPromoCodes(data);
    } catch (err) {
      setError('Не удалось загрузить промокоды.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromoCodes();
  }, [fetchPromoCodes]);
  
  const onSubmit = async (values) => {
    const payload = { ...values };
    if (payload.expiresAt === '') {
      payload.expiresAt = null;
    }
    
    try {
      await createPromoCode(payload);
      toast({
        title: "Успех!",
        description: "Промокод успешно создан.",
      });
      fetchPromoCodes(); // Refetch after creation
      form.reset();
    } catch (error) {
      console.error('Failed to create promo code', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: `Не удалось создать промокод: ${error.response?.data?.error || error.message}`,
      });
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Создать промокод</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Код</FormLabel>
                    <FormControl>
                      <Input placeholder="например, SUMMER30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип скидки</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Процент</SelectItem>
                        <SelectItem value="fixed_amount">Фиксированная сумма</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Значение скидки</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="например, 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Действует до (необязательно)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Создать</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Существующие промокоды</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Загрузка...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Код</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Значение</TableHead>
                  <TableHead>Использовано</TableHead>
                  <TableHead>Действует до</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promoCodes.map((pc) => (
                  <TableRow key={pc.id}>
                    <TableCell>{pc.code}</TableCell>
                    <TableCell>{pc.discountType}</TableCell>
                    <TableCell>{pc.discountValue}</TableCell>
                    <TableCell>{pc.usageCount}</TableCell>
                    <TableCell>{pc.expiresAt ? new Date(pc.expiresAt).toLocaleDateString() : 'Никогда'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoCodes;