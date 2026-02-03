function capitalizePathname(input: string): string {
  const segments = input.split('/');
  const lastSegment = segments[segments.length - 1];

  if (lastSegment) {
    return lastSegment
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } else return '';
}

export default capitalizePathname;
