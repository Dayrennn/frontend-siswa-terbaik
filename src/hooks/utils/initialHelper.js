export function getInitials(nama) {
    return (
        nama
            ?.split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('')
            .toUpperCase() ?? '?'
    );
}