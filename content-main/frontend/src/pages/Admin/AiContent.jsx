import { useEffect, useState, useCallback } from 'react';
import { getAiContent } from '../../api/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AiContent = () => {
  const [content, setContent] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAiContent({ page: currentPage });
      setContent(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Не удалось загрузить AI контент.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Модерация AI Контента</h2>

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
                <TableHead>Время</TableHead>
                <TableHead>Детали</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.User.email}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Показать запрос и контент</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <h4 className="font-semibold">Запрос:</h4>
                            <p className="text-sm bg-gray-100 p-2 rounded">{item.details.prompt}</p>
                            <h4 className="font-semibold">Сгенерированный контент:</h4>
                            <pre className="text-sm bg-gray-100 p-2 rounded whitespace-pre-wrap">
                              {JSON.stringify(item.details.generatedContent, null, 2)}
                            </pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
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

export default AiContent;