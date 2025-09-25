import { useEffect } from 'react';

interface ConfirmDeleteModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ConfirmDeleteModal({
    open,
    title,
    onClose,
    onConfirm,
}: ConfirmDeleteModalProps) {
    // Auto-focus nút confirm khi mở modal
    useEffect(() => {
        if (open) {
            const confirmBtn = document.getElementById('confirm-btn');
            confirmBtn?.focus();
        }
    }, [open]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
            aria-describedby="confirm-delete-description"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
            onClick={onClose} // click ngoài modal đóng
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    minWidth: 300,
                    padding: 20,
                    textAlign: 'center',
                }}
                onClick={(e) => e.stopPropagation()} // prevent click chồng lên overlay
            >
                {/* Title */}
                <div id="confirm-delete-title" style={{ marginBottom: 12 }}>
                    <span
                        style={{
                            fontSize: 40,
                            color: 'red',
                            display: 'block',
                            marginBottom: 8,
                        }}
                    >
                        ⚠️
                    </span>
                    <strong style={{ fontSize: 20, color: 'red' }}>
                        Xác nhận xóa
                    </strong>
                </div>

                {/* Description */}
                <div
                    id="confirm-delete-description"
                    style={{ marginBottom: 20, fontSize: 16 }}
                >
                    Bạn có chắc chắn muốn xóa <b>{title}</b> không?
                </div>

                {/* Actions */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 10,
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: '1px solid #ccc',
                            background: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        id="confirm-btn"
                        onClick={onConfirm}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: 'none',
                            background: 'red',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    );
}
