import { LucideIcon, ArrowRight } from 'lucide-react';

interface ManagementCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  subtitle: string;
  actionText: string;
  actionColor: string;
  onClick: () => void;
}

export default function ManagementCard({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  actionText,
  actionColor,
  onClick
}: ManagementCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`h-12 w-12 ${iconColor} rounded-lg flex items-center justify-center`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {subtitle}
              </dd>
            </dl>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className={`${actionColor} text-sm font-medium`}>
            {actionText}
          </span>
          <ArrowRight className={`w-4 h-4 ${actionColor.replace('text-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
}