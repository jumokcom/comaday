import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RankingTable.css';

interface User {
  id: number;
  username: string;
  coinCount: number;
  isAdmin: boolean;
  rank: number;
}

const RankingTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get<User[]>('http://localhost:4000/ranking');
        console.log('랭킹 데이터:', response.data); // 데이터 확인용 로그
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('랭킹 조회 에러:', err);
        setError('랭킹을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchRankings();
    // 30초마다 랭킹 업데이트
    const interval = setInterval(fetchRankings, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ranking-container">
      <h2>코인 랭킹</h2>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>이름</th>
            <th>ID</th>
            <th>보유 코인</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={user.isAdmin ? 'admin-row' : ''}>
              <td>{user.rank}</td>
              <td>
                {user.username}
                {user.isAdmin && <span className="admin-badge">관리자</span>}
              </td>
              <td>{user.id}</td>
              <td className="coin-count">{user.coinCount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable; 