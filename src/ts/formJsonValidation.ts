export interface IVariables {
  name: string;
  text: string;
  value: string;
}

export interface IPath {
  name: string;
  path: string;
}

export interface IForm {
  name: string;
  comment: string;
  variables: IVariables[];
  paths: IPath[];
}

export default function validateForm(obj: IForm): boolean {
  const allowedKeys: (keyof IForm)[] = [
    'name',
    'comment',
    'variables',
    'paths',
  ];

  for (const key in obj) {
    if (!allowedKeys.includes(key as keyof IForm)) {
      return false; // Найден неиспользуемый ключ
    }
  }

  return (
    typeof obj.name === 'string' &&
    typeof obj.comment === 'string' &&
    Array.isArray(obj.variables) &&
    obj.variables.every(
      (variable: IVariables) =>
        typeof variable === 'object' &&
        typeof variable.name === 'string' &&
        typeof variable.text === 'string' &&
        typeof variable.value === 'string' &&
        Object.keys(variable).every(
          (k) => k === 'name' || k === 'text' || k === 'value'
        )
    ) &&
    Array.isArray(obj.paths) &&
    obj.paths.every(
      (path: IPath) => typeof path === 'object' && typeof path.name === 'string'
    )
  );
}
