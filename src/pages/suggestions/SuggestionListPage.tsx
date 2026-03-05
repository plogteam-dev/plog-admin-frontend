import { Table } from 'antd';
import { useSuggestions } from '@/hooks/useSuggestions';
import { useQueryParams } from '@/hooks/useSearchParams';
import { PAGE_SIZE } from '@/constants';
import dayjs from 'dayjs';

export default function SuggestionListPage() {
  const { getNumber, set } = useQueryParams();
  const page = getNumber('page', 1);

  const { data, isLoading } = useSuggestions({ page, limit: PAGE_SIZE });

  const columns = [
    {
      title: '작성자',
      dataIndex: ['user', 'nickname'],
      width: 120,
    },
    {
      title: '이메일',
      dataIndex: ['user', 'email'],
      width: 200,
    },
    {
      title: '내용',
      dataIndex: 'content',
    },
    {
      title: '작성일',
      dataIndex: 'createdAt',
      width: 160,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data?.items}
      loading={isLoading}
      pagination={{
        current: page,
        total: data?.total,
        pageSize: PAGE_SIZE,
        onChange: (p) => set({ page: String(p) }),
        showTotal: (total) => `총 ${total}개`,
      }}
    />
  );
}
