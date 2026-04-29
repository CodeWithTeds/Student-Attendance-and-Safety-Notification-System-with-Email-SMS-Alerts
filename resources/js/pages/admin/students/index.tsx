import { Head, router, useForm } from '@inertiajs/react';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Download,
    GraduationCap,
    Pencil,
    Plus,
    QrCode,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status?: string;
    student_number?: string | null;
    qr_code_value?: string | null;
    qr_code_svg?: string | null;
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

interface AddStudentForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    middle_name: string;
    last_name: string;
}

const initialStudentForm: AddStudentForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    middle_name: '',
    last_name: '',
};

export default function StudentsIndex({ users }: Props) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeQrStudent, setActiveQrStudent] = useState<User | null>(null);
    const {
        data: studentForm,
        setData: setStudentForm,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<AddStudentForm>(initialStudentForm);

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
        const searchValue = search.toLowerCase();

        return (
            u.name.toLowerCase().includes(searchValue) ||
            u.email.toLowerCase().includes(searchValue) ||
            (u.student_number ?? '').toLowerCase().includes(searchValue)
        );
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

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        reset();
        clearErrors();
    };

    const submitStudent = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/admin/students', {
            preserveScroll: true,
            onSuccess: closeAddModal,
        });
    };

    const deleteUser = (id: number) => {
        if (confirm('Delete this student?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const approveUser = (id: number) => {
        if (confirm('Approve this student and generate a QR code?')) {
            router.post(
                `/admin/students/${id}/approve`,
                {},
                { preserveScroll: true },
            );
        }
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });

    return (
        <>
            <Head title="Student Management" />
            <style>{`
                .ut-root { font-family: 'Inter', system-ui, sans-serif; height: 100%; display: flex; flex-direction: column; gap: 0; margin: 16px; background: var(--background); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .ut-toolbar { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
                .ut-search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 280px; }
                .ut-search-wrap svg { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: #6b7280; pointer-events: none; }
                .ut-search { width: 100%; padding: 5px 10px 5px 32px; border: 1px solid var(--border); border-radius: 6px; font-size: 12.5px; background: var(--background); color: var(--foreground); outline: none; height: 30px; }
                .ut-search:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,.15); }
                .ut-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 500; cursor: pointer; border: none; height: 30px; white-space: nowrap; transition: opacity .15s; }
                .ut-btn:hover { opacity: .85; }
                .ut-btn:disabled { opacity: .55; cursor: not-allowed; }
                .ut-btn-primary { background: #6366f1; color: #fff; }
                .ut-btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--foreground); }
                .ut-btn-success { background: #10b981; color: #fff; }
                .ut-spacer { flex: 1; }
                .ut-count { font-size: 12px; color: #6b7280; padding: 0 4px; }

                .ut-table-wrap { flex: 1; overflow: auto; padding: 0 16px; }
                table.ut { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 960px; }
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
                .ut-muted { color: #6b7280; font-size: 11.5px; }

                .status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
                .status-pending { background: rgba(245,158,11,.12); color: #f59e0b; }
                .status-approved { background: rgba(16,185,129,.12); color: #10b981; }

                .qr-button { width: 34px; height: 34px; border: 1px solid var(--border); border-radius: 6px; background: #fff; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; }
                .qr-button:hover { border-color: #10b981; box-shadow: 0 0 0 2px rgba(16,185,129,.12); }
                .qr-button svg { width: 28px; height: 28px; }
                .qr-missing { display: inline-flex; align-items: center; gap: 5px; color: #9ca3af; font-size: 11.5px; }

                .ut-actions { display: flex; align-items: center; gap: 4px; }
                .ut-icon-btn { width: 26px; height: 26px; border: none; background: transparent; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; transition: background .15s, color .15s; }
                .ut-icon-btn:hover.approve { background: rgba(16,185,129,.1); color: #10b981; }
                .ut-icon-btn:hover.edit { background: rgba(99,102,241,.1); color: #6366f1; }
                .ut-icon-btn:hover.del { background: rgba(239,68,68,.1); color: #ef4444; }

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

                .student-modal-backdrop { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: rgba(15,23,42,.72); padding: 24px; }
                .student-modal { width: 80vw; max-width: 980px; max-height: 86vh; overflow: hidden; border: 1px solid var(--border); border-radius: 12px; background: var(--background); box-shadow: 0 24px 70px rgba(15,23,42,.28); display: flex; flex-direction: column; }
                .student-modal-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px 20px; border-bottom: 1px solid var(--border); }
                .student-modal-title { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; }
                .student-modal-subtitle { margin-top: 4px; color: #6b7280; font-size: 12.5px; }
                .student-modal-close { width: 30px; height: 30px; border: 1px solid var(--border); border-radius: 6px; background: transparent; color: var(--foreground); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
                .student-modal-body { overflow: auto; padding: 20px; }
                .student-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
                .student-field { display: flex; flex-direction: column; gap: 6px; }
                .student-field.full { grid-column: 1 / -1; }
                .student-label { color: var(--foreground); font-size: 12px; font-weight: 600; }
                .student-input { width: 100%; height: 38px; border: 1px solid var(--border); border-radius: 7px; background: var(--background); color: var(--foreground); padding: 8px 10px; font-size: 13px; outline: none; }
                .student-input:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,.14); }
                .student-error { color: #ef4444; font-size: 11.5px; }
                .student-modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--border); }
                .qr-preview { display: grid; gap: 12px; justify-items: center; padding: 8px 0 4px; }
                .qr-preview-box { width: min(300px, 60vw); aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: 10px; background: #fff; padding: 16px; }
                .qr-preview-box svg { width: 100%; height: 100%; }
                .qr-code-value { width: 100%; max-width: 520px; overflow-wrap: anywhere; border: 1px solid var(--border); border-radius: 8px; background: rgba(99,102,241,.04); padding: 10px; color: #6b7280; font-size: 12px; text-align: center; white-space: normal; }

                @media (max-width: 720px) {
                    .student-modal-backdrop { padding: 12px; align-items: flex-start; }
                    .student-modal { width: 100%; max-height: calc(100vh - 24px); }
                    .student-form-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="ut-root">
                <div className="ut-toolbar">
                    <div className="ut-search-wrap">
                        <Search size={13} />
                        <input
                            id="user-search"
                            className="ut-search"
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {selected.length > 0 && (
                        <span className="ut-count">
                            {selected.length} selected
                        </span>
                    )}

                    <div className="ut-spacer" />

                    <button id="export-btn" className="ut-btn ut-btn-ghost">
                        <Download size={13} /> Export
                    </button>

                    <button
                        id="add-user-btn"
                        className="ut-btn ut-btn-primary"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={13} /> Add Student
                    </button>
                </div>

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
                                <th>Student No.</th>
                                <th>Status</th>
                                <th>QR Code</th>
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
                                    <td colSpan={10}>
                                        <div className="empty-state">
                                            <GraduationCap size={40} />
                                            <p>No students found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((user, i) => {
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
                                    const isApproved =
                                        user.status === 'approved';

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
                                            <td className="ut-muted">
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
                                            <td className="ut-muted">
                                                {user.student_number ??
                                                    'Pending'}
                                            </td>
                                            <td>
                                                <span
                                                    className={`status-badge ${
                                                        isApproved
                                                            ? 'status-approved'
                                                            : 'status-pending'
                                                    }`}
                                                >
                                                    {isApproved
                                                        ? 'Approved'
                                                        : 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                {user.qr_code_svg ? (
                                                    <button
                                                        className="qr-button"
                                                        title="View student QR code"
                                                        onClick={() =>
                                                            setActiveQrStudent(
                                                                user,
                                                            )
                                                        }
                                                        type="button"
                                                    >
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: user.qr_code_svg,
                                                            }}
                                                        />
                                                    </button>
                                                ) : (
                                                    <span className="qr-missing">
                                                        <QrCode size={13} />
                                                        Not generated
                                                    </span>
                                                )}
                                            </td>
                                            <td className="ut-muted">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="ut-muted">
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
                                                    {!isApproved && (
                                                        <button
                                                            className="ut-icon-btn approve"
                                                            title="Approve and generate QR code"
                                                            onClick={() =>
                                                                approveUser(
                                                                    user.id,
                                                                )
                                                            }
                                                        >
                                                            <Check size={13} />
                                                        </button>
                                                    )}
                                                    <button
                                                        id={`edit-user-${user.id}`}
                                                        className="ut-icon-btn edit"
                                                        title="Edit"
                                                        onClick={() =>
                                                            router.visit(
                                                                `/admin/users/${user.id}/edit`,
                                                            )
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

                <div className="ut-footer">
                    <span className="ut-footer-info">
                        {meta.total > 0
                            ? `${meta.from}-${meta.to} of ${meta.total} students`
                            : 'No results'}
                    </span>

                    <div className="ut-pager">
                        <button
                            className="ut-page-btn"
                            disabled={meta.current_page === 1}
                            onClick={() => goToPage('?page=1')}
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
                                        className={`ut-page-btn ${
                                            meta.current_page === page
                                                ? 'active'
                                                : ''
                                        }`}
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

            {isAddModalOpen && (
                <div className="student-modal-backdrop" role="presentation">
                    <form className="student-modal" onSubmit={submitStudent}>
                        <div className="student-modal-header">
                            <div>
                                <div className="student-modal-title">
                                    <GraduationCap size={20} />
                                    Add Student
                                </div>
                                <p className="student-modal-subtitle">
                                    Create a pending student account. A unique
                                    QR code will be generated after approval.
                                </p>
                            </div>
                            <button
                                className="student-modal-close"
                                type="button"
                                onClick={closeAddModal}
                                aria-label="Close add student modal"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        <div className="student-modal-body">
                            <div className="student-form-grid">
                                <label className="student-field full">
                                    <span className="student-label">
                                        Display name
                                    </span>
                                    <input
                                        className="student-input"
                                        value={studentForm.name}
                                        onChange={(event) =>
                                            setStudentForm(
                                                'name',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Juan Dela Cruz"
                                    />
                                    {errors.name && (
                                        <span className="student-error">
                                            {errors.name}
                                        </span>
                                    )}
                                </label>

                                <label className="student-field">
                                    <span className="student-label">
                                        First name
                                    </span>
                                    <input
                                        className="student-input"
                                        value={studentForm.first_name}
                                        onChange={(event) =>
                                            setStudentForm(
                                                'first_name',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Juan"
                                    />
                                    {errors.first_name && (
                                        <span className="student-error">
                                            {errors.first_name}
                                        </span>
                                    )}
                                </label>

                                <label className="student-field">
                                    <span className="student-label">
                                        Middle name
                                    </span>
                                    <input
                                        className="student-input"
                                        value={studentForm.middle_name}
                                        onChange={(event) =>
                                            setStudentForm(
                                                'middle_name',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Santos"
                                    />
                                    {errors.middle_name && (
                                        <span className="student-error">
                                            {errors.middle_name}
                                        </span>
                                    )}
                                </label>

                                <label className="student-field">
                                    <span className="student-label">
                                        Last name
                                    </span>
                                    <input
                                        className="student-input"
                                        value={studentForm.last_name}
                                        onChange={(event) =>
                                            setStudentForm(
                                                'last_name',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Dela Cruz"
                                    />
                                    {errors.last_name && (
                                        <span className="student-error">
                                            {errors.last_name}
                                        </span>
                                    )}
                                </label>

                                <label className="student-field">
                                    <span className="student-label">Email</span>
                                    <input
                                        className="student-input"
                                        type="email"
                                        value={studentForm.email}
                                        onChange={(event) =>
                                            setStudentForm(
                                                'email',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="student@example.com"
                                    />
                                    {errors.email && (
                                        <span className="student-error">
                                            {errors.email}
                                        </span>
                                    )}
                                </label>

                                <label className="student-field">
                                    <span className="student-label">
                                        Password
                                    </span>
                                    <input
                                        className="student-input"
                                        type="password"
                                        value={studentForm.password}
                                        onChange={(event) =>
                                            setStudentForm(
                                                'password',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="At least 8 characters"
                                    />
                                    {errors.password && (
                                        <span className="student-error">
                                            {errors.password}
                                        </span>
                                    )}
                                </label>

                                <label className="student-field">
                                    <span className="student-label">
                                        Confirm password
                                    </span>
                                    <input
                                        className="student-input"
                                        type="password"
                                        value={
                                            studentForm.password_confirmation
                                        }
                                        onChange={(event) =>
                                            setStudentForm(
                                                'password_confirmation',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Repeat password"
                                    />
                                    {errors.password_confirmation && (
                                        <span className="student-error">
                                            {errors.password_confirmation}
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="student-modal-footer">
                            <button
                                className="ut-btn ut-btn-ghost"
                                type="button"
                                onClick={closeAddModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="ut-btn ut-btn-primary"
                                type="submit"
                                disabled={processing}
                            >
                                <Plus size={13} />
                                {processing ? 'Saving...' : 'Add Student'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeQrStudent && (
                <div className="student-modal-backdrop" role="presentation">
                    <div className="student-modal">
                        <div className="student-modal-header">
                            <div>
                                <div className="student-modal-title">
                                    <QrCode size={20} />
                                    Student QR Code
                                </div>
                                <p className="student-modal-subtitle">
                                    {activeQrStudent.name}
                                    {activeQrStudent.student_number
                                        ? ` - ${activeQrStudent.student_number}`
                                        : ''}
                                </p>
                            </div>
                            <button
                                className="student-modal-close"
                                type="button"
                                onClick={() => setActiveQrStudent(null)}
                                aria-label="Close QR code modal"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        <div className="student-modal-body">
                            <div className="qr-preview">
                                <div
                                    className="qr-preview-box"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            activeQrStudent.qr_code_svg ?? '',
                                    }}
                                />
                                {activeQrStudent.qr_code_value && (
                                    <div className="qr-code-value">
                                        {activeQrStudent.qr_code_value}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="student-modal-footer">
                            <button
                                className="ut-btn ut-btn-primary"
                                type="button"
                                onClick={() => setActiveQrStudent(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

StudentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Student Management', href: '/admin/students' },
    ],
};
