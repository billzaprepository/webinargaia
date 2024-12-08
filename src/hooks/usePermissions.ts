import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export const usePermissions = () => {
  const { currentUser } = useAuth();
  const { settings } = useSettings();

  const getUserPlan = () => {
    if (!currentUser?.subscription?.planId) return null;
    return settings.plans.find(plan => plan.id === currentUser.subscription.planId);
  };

  const canManageChat = () => {
    if (currentUser?.role === 'admin') return true;
    const plan = getUserPlan();
    return plan?.limits?.canManageChat || false;
  };

  const canManageCTA = () => {
    if (currentUser?.role === 'admin') return true;
    const plan = getUserPlan();
    return plan?.limits?.canManageCTA || false;
  };

  const canCustomizeTheme = () => {
    if (currentUser?.role === 'admin') return true;
    const plan = getUserPlan();
    return plan?.limits?.canCustomizeTheme || false;
  };

  const canUseTimer = () => {
    if (currentUser?.role === 'admin') return true;
    const plan = getUserPlan();
    return plan?.limits?.canUseTimer || false;
  };

  const canViewAnalytics = () => {
    if (currentUser?.role === 'admin') return true;
    const plan = getUserPlan();
    return plan?.limits?.canViewAnalytics || false;
  };

  const getWebinarLimit = () => {
    if (currentUser?.role === 'admin') return Infinity;
    const plan = getUserPlan();
    return plan?.limits?.maxWebinars || 0;
  };

  const getStorageLimit = () => {
    if (currentUser?.role === 'admin') return Infinity;
    const plan = getUserPlan();
    return plan?.limits?.maxStorage || 0;
  };

  const getViewersLimit = () => {
    if (currentUser?.role === 'admin') return Infinity;
    const plan = getUserPlan();
    return plan?.limits?.maxViewers || 0;
  };

  return {
    canManageChat,
    canManageCTA,
    canCustomizeTheme,
    canUseTimer,
    canViewAnalytics,
    getWebinarLimit,
    getStorageLimit,
    getViewersLimit
  };
};