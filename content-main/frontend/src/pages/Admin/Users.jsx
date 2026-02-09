import { useEffect, useState, useCallback } from 'react';
import { getUsers, deleteUser } from '../../api/admin'; // Import deleteUser
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import EditUserDialog from './EditUserDialog';
import ConfirmationDialog from '@/components/common/ConfirmationDialog'; // Import ConfirmationDialog
import { useToast } from "@/components/ui/use-toast"; // Import useToast
import { Trash2 } from 'lucide-react'; // Import icon


const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
  const [userToDelete, setUserToDelete] = useState(null); // User object to be deleted


  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers({
        page: currentPage,
        search: debouncedSearchTerm,
        role: roleFilter,
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Не удалось загрузить пользователей.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditClick = (userId) => {
    setEditingUserId(userId);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      toast({
        title: "Успех!",
        description: `Пользователь ${userToDelete.email} удален.`,
      });
      fetchUsers(); // Refetch users after deletion
    } catch (err) {
      console.error('Failed to delete user:', err);
      let errorMessage = 'Не удалось удалить пользователя.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      toast({
        variant: "destructive",
        title: "Ошибка удаления",
        description: errorMessage,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };


  const handleUserUpdated = () => {
    fetchUsers(); // Refetch users after an update
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Управление пользователями</h2>
      
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Поиск по имени или email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Фильтр по роли" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все роли</SelectItem>
            <SelectItem value="Admin">Администратор</SelectItem>
            <SelectItem value="Moderator">Модератор</SelectItem>
            <SelectItem value="Support">Поддержка</SelectItem>
            <SelectItem value="manager">Менеджер</SelectItem>
          </SelectContent>
        </Select>
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
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(user.id)}>Редактировать</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(user)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

      <EditUserDialog
        userId={editingUserId}
        isOpen={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUserUpdated={handleUserUpdated}
      />
      
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Подтвердите удаление пользователя"
        description={
          userToDelete
            ? `Вы уверены, что хотите удалить пользователя ${userToDelete.email}? Это действие необратимо.`
            : 'Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.'
        }
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default Users;