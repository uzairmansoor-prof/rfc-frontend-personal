export enum UserType {
  SUPER_ADMIN = 1,
}

export const UserTypeText: Record<UserType, string> = {
  [UserType.SUPER_ADMIN]: "Super Admin",
};

export const UserTypeBaseUrl: Record<UserType, string> = {
  [UserType.SUPER_ADMIN]: "/super-admin",
};

export const userTypeOptions = (userType) =>
  Object.entries(UserTypeText)
    .map(([value, text]) => ({ text, value: +value }))
    .filter(({ value }) => {
      return value > userType;
    })
    .sort((a, b) => a.text.localeCompare(b.text));
