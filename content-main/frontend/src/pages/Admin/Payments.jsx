import { useEffect, useState, useCallback } from 'react';
import { getPayments } from '../../api/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async (cursor) => {
    try {
      setLoading(true);
      const data = await getPayments({ cursor });
      setPayments(data.items);
      setNextCursor(data.next_cursor);
    } catch (err) {
      setError('Не удалось загрузить платежи.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments(null);
  }, [fetchPayments]);

  const handleNextPage = () => {
    if (nextCursor) {
      fetchPayments(nextCursor);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Управление платежами</h2>

      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Метод оплаты</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.amount.value} {payment.amount.currency}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleString()}</TableCell>
                  <TableCell>{payment.payment_method.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!nextCursor}
            >
              Вперед
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Payments;