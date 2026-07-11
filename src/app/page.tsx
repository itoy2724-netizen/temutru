import DashboardLayout from '@/components/DashboardLayout';
import { query } from '@/lib/db';

interface Stats {
  logs: number;
  products: number;
  addresses: number;
  categories: number;
}

interface Log {
  id: number;
  kredi_karti: string;
  banka: string;
  tarih: string;
  durum: string;
  tutar: string;
}

async function getStats(): Promise<Stats> {
  try {
    const [logs] = await query<{ count: number }[]>('SELECT COUNT(*) as count FROM logs');
    const [products] = await query<{ count: number }[]>('SELECT COUNT(*) as count FROM products');
    const [addresses] = await query<{ count: number }[]>('SELECT COUNT(*) as count FROM addresses');
    const [categories] = await query<{ count: number }[]>('SELECT COUNT(*) as count FROM categories');

    return {
      logs: logs?.count || 0,
      products: products?.count || 0,
      addresses: addresses?.count || 0,
      categories: categories?.count || 0,
    };
  } catch (error) {
    console.error('Stats error:', error);
    return { logs: 0, products: 0, addresses: 0, categories: 0 };
  }
}



export default async function Dashboard() {
  const stats = await getStats();

  const statCards = [
    { name: 'Toplam Log', value: stats.logs, icon: '📋', color: 'bg-blue-500' },
    { name: 'Toplam Ürün', value: stats.products, icon: '📦', color: 'bg-green-500' },
    { name: 'Toplam Adres', value: stats.addresses, icon: '📍', color: 'bg-purple-500' },
    { name: 'Kategoriler', value: stats.categories, icon: '🏷️', color: 'bg-orange-500' },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Hoş geldiniz! Genel durumu görüntüleyin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>


    </DashboardLayout>
  );
}
