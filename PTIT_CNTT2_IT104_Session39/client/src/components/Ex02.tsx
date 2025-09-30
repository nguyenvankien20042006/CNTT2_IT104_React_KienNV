import React, { useState } from "react"
import axios from "axios"

export default function Ex02() {
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const cloudName = 'dxkw3nupk'
    const uploadPreset = 're_upload'

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : []
        setFiles(selectedFiles)
        setUploadedUrls([])
        setPreviews(selectedFiles.map(file => URL.createObjectURL(file)))
    };

    const handleUpload = async () => {
        if (!files.length) return alert("Vui lòng chọn ít nhất 1 ảnh!")
        setLoading(true);
        try {
            const urls = await Promise.all(
                files.map(async file => {
                    const formData = new FormData()
                    formData.append("file", file)
                    formData.append("upload_preset", uploadPreset)
                    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,formData)
                    return res.data.secure_url
                })
            )
        setUploadedUrls(urls)
        setPreviews([])
        } catch {
            alert("Upload thất bại. Kiểm tra lại preset và cloud name trong .env")
        } finally {
            setLoading(false)
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Upload Multiple Images</h2>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
            {previews.length > 0 && (
                <div style={{ marginTop: 15 }}>
                    <p>Ảnh xem trước:</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {previews.map((src, idx) => (
                        <img key={idx} src={src} alt="" style={{ width: 150, border: "1px solid #ddd" }} />
                        ))}
                    </div>
                </div>
            )}
            <div style={{ marginTop: 15 }}>
                <button onClick={handleUpload} disabled={loading}>
                {loading ? "Đang upload..." : "Upload"}
                </button>
            </div>
            {uploadedUrls.length > 0 && (
                <div style={{ marginTop: 15 }}>
                    <p>Ảnh sau khi upload:</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {uploadedUrls.map((url, idx) => (
                        <div key={idx}>
                            <img src={url} alt="" style={{ width: 150, border: "1px solid #ddd" }} />
                            <p>
                            <a href={url} target="_blank" rel="noopener noreferrer">Xem ảnh</a>
                            </p>
                        </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}