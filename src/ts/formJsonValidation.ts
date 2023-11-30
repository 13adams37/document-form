interface IVariable {
  name: string;
  text: string;
}

interface IPath {
  name: string;
  path: string;
}

interface IForm {
  name: string;
  comment: string;
  variables: IVariable[];
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
      (variable: IVariable) =>
        typeof variable === 'object' &&
        typeof variable.name === 'string' &&
        typeof variable.text === 'string' &&
        Object.keys(variable).every((k) => k === 'name' || k === 'text')
    ) &&
    Array.isArray(obj.paths) &&
    obj.paths.every(
      (path: IPath) =>
        typeof path === 'object' &&
        typeof path.name === 'string' &&
        typeof path.path === 'string' &&
        Object.keys(path).every((k) => k === 'name' || k === 'path')
    )
  );
}
