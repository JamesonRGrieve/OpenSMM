import { FiImage, FiSettings, FiCalendar, FiBell, FiInfo, FiHome } from 'react-icons/fi';
import Link from 'next/link';

export function Button({ label, href, icon }) {
  return (
    <li className='w-full'>
      <Link href={href} className='w-full flex py-2 px-4 items-center justify-between'>
        <div>{icon}</div>
        <span>{label}</span>
      </Link>
    </li>
  );
}

const nav = [
  {
    label: 'Home',
    href: '/',
    icon: <FiHome />,
  },
  {
    label: 'Posts',
    href: '/posts',
    icon: <FiBell />,
  },
  {
    label: 'Schedule',
    href: '/schedule',
    icon: <FiCalendar />,
  },
  {
    label: 'Media',
    href: '/media',
    icon: <FiImage />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <FiSettings />,
  },
  {
    label: 'About',
    href: '/about',
    icon: <FiInfo />,
  },
];

export default function Sidebar() {
  return nav.map((item) => <Button key={item.label} {...item} />);
}
