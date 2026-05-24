import { Head, router, useForm } from '@inertiajs/react';
import {
    Search,
    Plus,
    Download,
    Trash2,
    Pencil,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    UserCircle2,
    ShieldCheck,
    GraduationCap,
    Heart,
    Save,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { ElementType } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    users: { data: User[]; meta: Omit<PaginatedUsers, 'data'> };
}

const roleMeta: Record<
    string,
    { label: string; color: string; icon: ElementType }
> = {
    admin: { label: 'Admin', color: 'role-admin', icon: ShieldCheck },
    parent: { label: 'Parent', color: 'role-parent', icon: Heart },
    student: { label: 'Student', color: 'role-student', icon: GraduationCap },
};

type UserForm = {
    name: string;
    email: string;
    role: 'admin' | 'parent' | 'student';
    password: string;
    password_confirmation: string;
    first_name: string;
    middle_name: string;
    last_name: string;
};

const emptyUserForm: UserForm = {
    name: '',
    email: '',
    role: 'admin',
    password: '',
    password_confirmation: '',
    first_name: '',
    middle_name: '',
    last_name: '',
};

export default function UsersIndex({ users }: Props) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const [roleFilter, setRoleFilter] = useState('');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const data: User[] = users?.data ?? [];
    const meta = users?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
    };

    const filtered = data.filter((u) => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter ? u.role === roleFilter : true;

        return matchSearch && matchRole;
    });

    const allSelected =
        filtered.length > 0 && filtered.every((u) => selected.includes(u.id));
    const toggleAll = () =>
        setSelected(allSelected ? [] : filtered.map((u) => u.id));
    const toggleOne = (id: number) =>
        setSelected((p) =>
            p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
        );

    const goToPage = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    const deleteUser = (id: number) => {
        if (confirm('Delete this user?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const openCreateUser = () => {
        setEditingUser(null);
        setIsUserModalOpen(true);
    };

    const openEditUser = (user: User) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };

    const handleExport = () => {
        const exportData = filtered.length > 0 ? filtered : data;

        if (exportData.length === 0) return;

        const headers = ['ID', 'Name', 'Email', 'Role', 'Created At', 'Updated At'];
        const csvContent = [
            headers.join(','),
            ...exportData.map((user) =>
                [
                    user.id,
                    `"${user.name}"`,
                    `"${user.email}"`,
                    `"${user.role}"`,
                    `"${new Date(user.created_at).toLocaleDateString()}"`,
                    `"${new Date(user.updated_at).toLocaleDateString()}"`,
                ].join(','),
            ),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `users_export_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });

    return (
        <>
            <Head title="User Management" />
            <style>{`
                .ut-root { font-family: 'Inter', system-ui, sans-serif; height: 100%; display: flex; flex-direction: column; gap: 0; margin: 16px; background: var(--background); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .ut-toolbar { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
                .ut-search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 280px; }
                .ut-search-wrap svg { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: #6b7280; pointer-events: none; }
                .ut-search { width: 100%; padding: 5px 10px 5px 32px; border: 1px solid var(--border); border-radius: 6px; font-size: 12.5px; background: var(--background); color: var(--foreground); outline: none; height: 30px; }
                .ut-search:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,.15); }
                .ut-select { padding: 5px 10px; border: 1px solid var(--border); border-radius: 6px; font-size: 12.5px; background: var(--background); color: var(--foreground); outline: none; height: 30px; cursor: pointer; }
                .ut-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 500; cursor: pointer; border: none; height: 30px; white-space: nowrap; transition: opacity .15s; }
                .ut-btn:hover { opacity: .85; }
                .ut-btn-primary { background: #6366f1; color: #fff; }
                .ut-btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--foreground); }
                .ut-btn-danger { background: #ef4444; color: #fff; }
                .ut-spacer { flex: 1; }
                .ut-count { font-size: 12px; color: #6b7280; padding: 0 4px; }

                .ut-table-wrap { flex: 1; overflow: auto; padding: 0 16px; }
                table.ut { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 800px; }
                table.ut thead tr { border-bottom: 1.5px solid var(--border); }
                table.ut thead th { padding: 7px 10px; text-align: left; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; background: var(--background); position: sticky; top: 0; z-index: 1; }
                table.ut thead th:first-child { padding-left: 4px; width: 36px; }
                table.ut tbody tr { border-bottom: 1px solid var(--border); transition: background .1s; }
                table.ut tbody tr:hover { background: rgba(99,102,241,.04); }
                table.ut tbody tr.selected-row { background: rgba(99,102,241,.07); }
                table.ut tbody td { padding: 6px 10px; vertical-align: middle; color: var(--foreground); white-space: nowrap; }
                table.ut tbody td:first-child { padding-left: 4px; }

                .ut-avatar { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
                .ut-user-cell { display: flex; align-items: center; gap: 8px; }
                .ut-name { font-weight: 500; font-size: 12.5px; }
                .ut-email { font-size: 11.5px; color: #6b7280; }

                .role-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
                .role-admin   { background: rgba(99,102,241,.12); color: #6366f1; }
                .role-parent  { background: rgba(236,72,153,.12); color: #ec4899; }
                .role-student { background: rgba(16,185,129,.12); color: #10b981; }

                .ut-actions { display: flex; align-items: center; gap: 4px; }
                .ut-icon-btn { width: 26px; height: 26px; border: none; background: transparent; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; transition: background .15s, color .15s; }
                .ut-icon-btn:hover.edit { background: rgba(99,102,241,.1); color: #6366f1; }
                .ut-icon-btn:hover.del  { background: rgba(239,68,68,.1);  color: #ef4444; }

                .ut-footer { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 8px; }
                .ut-footer-info { font-size: 12px; color: #6b7280; }
                .ut-pager { display: flex; align-items: center; gap: 3px; }
                .ut-page-btn { width: 28px; height: 28px; border: 1px solid var(--border); border-radius: 5px; background: var(--background); color: var(--foreground); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; transition: background .15s; }
                .ut-page-btn:hover:not(:disabled) { background: rgba(99,102,241,.08); border-color: #6366f1; }
                .ut-page-btn:disabled { opacity: .4; cursor: not-allowed; }
                .ut-page-btn.active { background: #6366f1; color: #fff; border-color: #6366f1; font-weight: 600; }

                .cb { width: 14px; height: 14px; border-radius: 3px; border: 1.5px solid #d1d5db; cursor: pointer; appearance: none; display: inline-flex; align-items: center; justify-content: center; background: var(--background); transition: all .1s; flex-shrink: 0; }
                .cb:checked { background: #6366f1; border-color: #6366f1; }
                .cb:checked::after { content: ''; display: block; width: 8px; height: 8px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M1 6l4 4 6-6'/%3E%3C/svg%3E") center/contain no-repeat; }

                .empty-state { text-align: center; padding: 48px 16px; color: #6b7280; }
                .empty-state svg { margin: 0 auto 12px; opacity: .4; }
                .empty-state p { font-size: 13px; }
            `}</style>

            <div className="ut-root">
                {/* ── Toolbar ── */}
                <div className="ut-toolbar">
                    <div className="ut-search-wrap">
                        <Search size={13} />
                        <input
                            id="user-search"
                            className="ut-search"
                            placeholder="Search users…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        id="role-filter"
                        className="ut-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="parent">Parent</option>
                        <option value="student">Student</option>
                    </select>

                    {selected.length > 0 && (
                        <span className="ut-count">
                            {selected.length} selected
                        </span>
                    )}

                    <div className="ut-spacer" />

                    <button id="export-btn" className="ut-btn ut-btn-ghost" onClick={handleExport}>
                        <Download size={13} /> Export
                    </button>

                    <button
                        id="add-user-btn"
                        className="ut-btn ut-btn-primary"
                        onClick={openCreateUser}
                    >
                        <Plus size={13} /> Add User
                    </button>
                </div>

                {/* ── Table ── */}
                <div className="ut-table-wrap">
                    <table className="ut">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        className="cb"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th
                                    style={{
                                        textAlign: 'right',
                                        paddingRight: 4,
                                    }}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8}>
                                        <div className="empty-state">
                                            <UserCircle2 size={40} />
                                            <p>No users found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((user, i) => {
                                    const rm = roleMeta[user.role] ?? {
                                        label: user.role,
                                        color: 'role-student',
                                        icon: UserCircle2,
                                    };
                                    const RoleIcon = rm.icon;
                                    const initials = user.name
                                        .split(' ')
                                        .map((w) => w[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase();
                                    const avatarColors = [
                                        '#6366f1',
                                        '#ec4899',
                                        '#10b981',
                                        '#f59e0b',
                                        '#3b82f6',
                                        '#8b5cf6',
                                    ];
                                    const bg =
                                        avatarColors[
                                            user.id % avatarColors.length
                                        ];
                                    const isSelected = selected.includes(
                                        user.id,
                                    );

                                    return (
                                        <tr
                                            key={user.id}
                                            className={
                                                isSelected ? 'selected-row' : ''
                                            }
                                        >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className="cb"
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        toggleOne(user.id)
                                                    }
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    color: '#9ca3af',
                                                    fontSize: 11,
                                                }}
                                            >
                                                {(meta.from ?? 0) + i}
                                            </td>
                                            <td>
                                                <div className="ut-user-cell">
                                                    <div
                                                        className="ut-avatar"
                                                        style={{
                                                            background: bg,
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        {initials}
                                                    </div>
                                                    <span className="ut-name">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="ut-email">
                                                {user.email}
                                            </td>
                                            <td>
                                                <span
                                                    className={`role-badge ${rm.color}`}
                                                >
                                                    <RoleIcon size={10} />
                                                    {rm.label}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    color: '#6b7280',
                                                    fontSize: 11.5,
                                                }}
                                            >
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td
                                                style={{
                                                    color: '#6b7280',
                                                    fontSize: 11.5,
                                                }}
                                            >
                                                {formatDate(user.updated_at)}
                                            </td>
                                            <td>
                                                <div
                                                    className="ut-actions"
                                                    style={{
                                                        justifyContent:
                                                            'flex-end',
                                                    }}
                                                >
                                                    <button
                                                        id={`edit-user-${user.id}`}
                                                        className="ut-icon-btn edit"
                                                        title="Edit"
                                                        onClick={() =>
                                                            openEditUser(user)
                                                        }
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button
                                                        id={`delete-user-${user.id}`}
                                                        className="ut-icon-btn del"
                                                        title="Delete"
                                                        onClick={() =>
                                                            deleteUser(user.id)
                                                        }
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Footer / Pagination ── */}
                <div className="ut-footer">
                    <span className="ut-footer-info">
                        {meta.total > 0
                            ? `${meta.from}–${meta.to} of ${meta.total} users`
                            : 'No results'}
                    </span>

                    <div className="ut-pager">
                        <button
                            className="ut-page-btn"
                            disabled={meta.current_page === 1}
                            onClick={() => goToPage(`?page=1`)}
                            title="First page"
                        >
                            <ChevronsLeft size={13} />
                        </button>
                        <button
                            className="ut-page-btn"
                            disabled={meta.current_page === 1}
                            onClick={() =>
                                goToPage(`?page=${meta.current_page - 1}`)
                            }
                            title="Previous page"
                        >
                            <ChevronLeft size={13} />
                        </button>

                        {Array.from(
                            { length: Math.min(meta.last_page, 7) },
                            (_, i) => {
                                const page = i + 1;

                                return (
                                    <button
                                        key={page}
                                        className={`ut-page-btn ${meta.current_page === page ? 'active' : ''}`}
                                        onClick={() =>
                                            goToPage(`?page=${page}`)
                                        }
                                    >
                                        {page}
                                    </button>
                                );
                            },
                        )}

                        <button
                            className="ut-page-btn"
                            disabled={meta.current_page === meta.last_page}
                            onClick={() =>
                                goToPage(`?page=${meta.current_page + 1}`)
                            }
                            title="Next page"
                        >
                            <ChevronRight size={13} />
                        </button>
                        <button
                            className="ut-page-btn"
                            disabled={meta.current_page === meta.last_page}
                            onClick={() => goToPage(`?page=${meta.last_page}`)}
                            title="Last page"
                        >
                            <ChevronsRight size={13} />
                        </button>
                    </div>
                </div>
            </div>

            <UserFormModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                editingUser={editingUser}
            />
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'User Management', href: '/admin/users' },
    ],
};

function UserFormModal({
    isOpen,
    onClose,
    editingUser,
}: {
    isOpen: boolean;
    onClose: () => void;
    editingUser: User | null;
}) {
    const isEditing = editingUser !== null;
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<UserForm>(emptyUserForm);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (editingUser) {
            setData({
                name: editingUser.name ?? '',
                email: editingUser.email ?? '',
                role: (editingUser.role as UserForm['role']) ?? 'admin',
                password: '',
                password_confirmation: '',
                first_name: editingUser.first_name ?? '',
                middle_name: editingUser.middle_name ?? '',
                last_name: editingUser.last_name ?? '',
            });

            return;
        }

        setData(emptyUserForm);
    }, [editingUser, isOpen, setData]);

    if (!isOpen) {
        return null;
    }

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: handleClose,
        };

        if (editingUser) {
            put(`/admin/users/${editingUser.id}`, options);

            return;
        }

        post('/admin/users', options);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
            <form
                className="flex max-h-[86vh] w-full max-w-[860px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
                    <div>
                        <div className="flex items-center gap-2.5 text-lg font-bold text-[var(--foreground)]">
                            <UserCircle2
                                className="text-[var(--primary)]"
                                size={22}
                            />
                            {isEditing ? 'Edit User' : 'Add User'}
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            {isEditing
                                ? 'Update account details. Leave password fields blank to keep the current password.'
                                : 'Create an account and assign the correct system role.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
                        aria-label="Close user form"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Display name
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                placeholder="Juan Dela Cruz"
                                required
                            />
                            {errors.name && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                First name
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={data.first_name}
                                onChange={(event) =>
                                    setData('first_name', event.target.value)
                                }
                                placeholder="Juan"
                            />
                            {errors.first_name && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.first_name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Middle name
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={data.middle_name}
                                onChange={(event) =>
                                    setData('middle_name', event.target.value)
                                }
                                placeholder="Santos"
                            />
                            {errors.middle_name && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.middle_name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Last name
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={data.last_name}
                                onChange={(event) =>
                                    setData('last_name', event.target.value)
                                }
                                placeholder="Dela Cruz"
                            />
                            {errors.last_name && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.last_name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Role
                            </label>
                            <select
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                value={data.role}
                                onChange={(event) =>
                                    setData(
                                        'role',
                                        event.target.value as UserForm['role'],
                                    )
                                }
                                required
                            >
                                <option value="admin">Admin</option>
                                <option value="parent">Parent</option>
                                <option value="student">Student</option>
                            </select>
                            {errors.role && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.role}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Email
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                placeholder="user@example.com"
                                required
                            />
                            {errors.email && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                {isEditing ? 'New password' : 'Password'}
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                type="password"
                                value={data.password}
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                                placeholder={
                                    isEditing
                                        ? 'Optional'
                                        : 'At least 8 characters'
                                }
                                required={!isEditing}
                            />
                            {errors.password && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--foreground)]">
                                Confirm password
                            </label>
                            <input
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] transition-all outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(event) =>
                                    setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                placeholder={
                                    isEditing ? 'Optional' : 'Repeat password'
                                }
                                required={!isEditing}
                            />
                            {errors.password_confirmation && (
                                <span className="text-[11px] font-medium text-red-500">
                                    {errors.password_confirmation}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] p-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] shadow-sm transition-colors hover:opacity-90 disabled:opacity-50"
                    >
                        {isEditing ? <Save size={14} /> : <Plus size={14} />}
                        {processing
                            ? 'Saving...'
                            : isEditing
                              ? 'Update User'
                              : 'Add User'}
                    </button>
                </div>
            </form>
        </div>
    );
}
