export const metadata = {
  title: 'Optik Han Stok Takip',
  description: 'Stok ve kar-zarar yönetim uygulaması',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
