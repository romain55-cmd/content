import { useEffect, useState, useCallback } from 'react';
import { getAuditLogs } from '../../api/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '../../hooks/use-debounce';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const debouncedUserFilter = useDebounce(userFilter, 500);
  const debouncedActionFilter = useDebounce(actionFilter, 500);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAuditLogs({
        page: currentPage,
        userId: debouncedUserFilter,
        action: debouncedActionFilter,
      });
      setLogs(data.logs);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Не удалось загрузить логи аудита.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedUserFilter, debouncedActionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Аудит</h2>
      
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Фильтр по ID пользователя..."
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Фильтр по действию..."
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Действие</TableHead>
                <TableHead>ID цели</TableHead>
                <TableHead>Время</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.User.email}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.targetId}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Назад
            </Button>
            <span>
              Страница {currentPage} из {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Вперед
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuditLog;