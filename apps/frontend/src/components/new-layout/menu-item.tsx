'use client';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

export const MenuItem: FC<{ label: string; icon: ReactNode; path: string; onClick?: () => void }> = ({
  label,
  icon,
  path,
  onClick,
}) => {
  const currentPath = usePathname();
  const isActive = currentPath.indexOf(path) === 0;

  const className = clsx(
    'group w-full minCustom:h-[56px] custom:h-[46px] py-[8px] px-[6px] minCustom:gap-[5px] custom:gap-[2px] flex flex-col font-[500] items-center justify-center rounded-[14px] transition-all duration-200 relative',
    isActive
      ? 'text-white bg-gradient-to-b from-indigo-500/25 to-indigo-600/10 border border-indigo-500/30 shadow-[0_2px_12px_rgba(99,102,241,0.22)]'
      : 'text-textItemBlur hover:text-white hover:bg-white/[0.06]'
  );

  const inner = (
    <>
      <div className={clsx("transition-transform duration-200 group-hover:scale-110", isActive && "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]")}>{icon}</div>
      <div className={clsx("custom:text-[9px] minCustom:text-[10px] leading-[1.1] text-center tracking-wide", isActive ? "font-semibold text-white" : "font-normal")}>
        {label}
      </div>
      {isActive && (
        <span className="absolute -start-[6px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" />
      )}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} title={label} className={className}>
        {inner}
      </button>
    );
  }

  return (
    <Link
      prefetch={true}
      href={path}
      title={label}
      {...path.indexOf('http') === 0 && { target: '_blank' }}
      className={className}
    >
      {inner}
    </Link>
  );
};
