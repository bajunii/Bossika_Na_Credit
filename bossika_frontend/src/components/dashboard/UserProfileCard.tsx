/**
 * User Profile Card Component
 * Displays user account information and quick profile details
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, Settings } from 'lucide-react';
import type { User as UserModel } from '@/types/models';

interface UserProfileCardProps {
  user: UserModel;
  onEditProfile?: () => void;
}

export default function UserProfileCard({ user, onEditProfile }: UserProfileCardProps) {
  const getInitials = () => {
    if (user.profile?.first_name && user.profile?.last_name) {
      return `${user.profile.first_name[0]}${user.profile.last_name[0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  const getFullName = () => {
    if (user.profile?.first_name && user.profile?.last_name) {
      return `${user.profile.first_name} ${user.profile.last_name}`;
    }
    return user.username;
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Profile</CardTitle>
          {onEditProfile && (
            <Button variant="ghost" size="sm" onClick={onEditProfile}>
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-blue-200">
            <AvatarImage src={user.profile?.avatar_url} alt={getFullName()} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{getFullName()}</h3>
            <p className="text-sm text-gray-600">@{user.username}</p>
            <div className="flex gap-2 mt-1">
              {user.email_verified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Verified
                </Badge>
              )}
              {user.is_active && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.profile?.bio && (
          <p className="text-sm text-gray-700 pt-2 border-t">{user.profile.bio}</p>
        )}

        {/* Contact Information */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">
              Joined {new Date(user.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Business Profiles Count */}
        {user.business_profiles && user.business_profiles.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Business Profiles</span>
              <Badge variant="secondary">{user.business_profiles.length}</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
