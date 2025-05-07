import React, { useState, useEffect } from 'react';
import { adminService } from '../api/services/adminService';
import { User } from '../types/user';
import { useMessage } from '../contexts/MessageContext';
import { useUser } from '../contexts/UserContext';
import './AdminPage.css';

export const AdminPage = () => {
  const [newUsers, setNewUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const { showError, showSuccess } = useMessage();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.isAdmin) {
      showError('관리자 권한이 필요합니다.');
      return;
    }
    loadNewUsers();
  }, [user]);

  const loadNewUsers = async () => {
    try {
      const users = await adminService.getNewUsers();
      setNewUsers(users);
    } catch (error) {
      showError('새로운 사용자 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      await adminService.approveNewUser(userId);
      showSuccess('사용자가 승인되었습니다.');
      loadNewUsers();
    } catch (error) {
      showError('사용자 승인에 실패했습니다.');
    }
  };

  const handleReject = async (userId: number) => {
    try {
      await adminService.rejectNewUser(userId);
      showSuccess('사용자가 거부되었습니다.');
      loadNewUsers();
    } catch (error) {
      showError('사용자 거부에 실패했습니다.');
    }
  };

  const handleSendCoins = async () => {
    if (!selectedUser) return;
    if (coinAmount <= 0) {
      showError('코인 수량은 0보다 커야 합니다.');
      return;
    }

    try {
      await adminService.sendCoinsToUser(selectedUser.id, coinAmount);
      showSuccess(`${coinAmount}개의 코인이 전송되었습니다.`);
      setCoinAmount(0);
      setSelectedUser(null);
    } catch (error) {
      showError('코인 전송에 실패했습니다.');
    }
  };

  const handleGrantAdmin = async (userId: number) => {
    try {
      await adminService.grantAdmin(userId);
      showSuccess('관리자 권한이 부여되었습니다.');
      loadNewUsers();
    } catch (error) {
      showError('관리자 권한 부여에 실패했습니다.');
    }
  };

  const handleRevokeAdmin = async (userId: number) => {
    try {
      await adminService.revokeAdmin(userId);
      showSuccess('관리자 권한이 해제되었습니다.');
      loadNewUsers();
    } catch (error) {
      showError('관리자 권한 해제에 실패했습니다.');
    }
  };

  if (!user?.isAdmin) {
    return <div className="admin-page">관리자 권한이 필요합니다.</div>;
  }

  return (
    <div className="admin-page">
      <h2>관리자 페이지</h2>
      
      <section className="new-users-section">
        <h3>새로운 사용자</h3>
        <div className="new-users-list">
          {newUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <p>아이디: {user.username}</p>
                <p>회원번호: {user.id}</p>
                <p>가입일: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>관리자 여부: {user.isAdmin ? '예' : '아니오'}</p>
              </div>
              <div className="user-actions">
                <button onClick={() => handleApprove(user.id)}>승인</button>
                <button onClick={() => handleReject(user.id)}>거부</button>
                {!user.isAdmin ? (
                  <button onClick={() => handleGrantAdmin(user.id)}>관리자 권한 부여</button>
                ) : (
                  <button onClick={() => handleRevokeAdmin(user.id)}>관리자 권한 해제</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="send-coins-section">
        <h3>코인 전송</h3>
        <div className="send-coins-form">
          <select 
            value={selectedUser?.id || ''} 
            onChange={(e) => {
              const user = newUsers.find(u => u.id === Number(e.target.value));
              setSelectedUser(user || null);
            }}
          >
            <option value="">사용자 선택</option>
            {newUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.id})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={coinAmount}
            onChange={(e) => setCoinAmount(Number(e.target.value))}
            placeholder="코인 수량"
            min="1"
          />
          <button onClick={handleSendCoins}>코인 전송</button>
        </div>
      </section>
    </div>
  );
}; 