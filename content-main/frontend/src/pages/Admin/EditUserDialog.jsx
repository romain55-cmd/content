import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUserById, updateUser } from '../../api/admin';

const EditUserDialog = ({ userId, isOpen, onOpenChange, onUserUpdated }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId && isOpen) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const userData = await getUserById(userId);
          setUser(userData);
        } catch (err) {
          setError('Не удалось загрузить данные пользователя.');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userId, user);
      onUserUpdated();
      onOpenChange(false);
    } catch (err) {
      setError('Не удалось обновить пользователя.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
        </DialogHeader>
        {loading && <div>Загрузка...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {user && (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">Имя</Label>
                <Input id="firstName" name="firstName" value={user.firstName} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Фамилия</Label>
                <Input id="lastName" name="lastName" value={user.lastName} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Роль</Label>
                <Select value={user.role} onValueChange={(value) => handleSelectChange('role', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Администратор</SelectItem>
                    <SelectItem value="Moderator">Модератор</SelectItem>
                    <SelectItem value="Support">Поддержка</SelectItem>
                    <SelectItem value="manager">Менеджер</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

EditUserDialog.propTypes = {
  userId: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onUserUpdated: PropTypes.func.isRequired,
};

export default EditUserDialog;
