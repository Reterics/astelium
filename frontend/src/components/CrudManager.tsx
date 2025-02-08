import { useEffect, useState } from "react";
import Modal from "./Modal.tsx";
import {getFetchOptions} from "../utils.ts";

interface CrudField<T> {
    name: keyof T & string;
    label: string;
    type: string;
}

interface CrudManagerProps<T extends Record<string, any>> {
    title: string;
    apiEndpoint: string;
    fields: CrudField<T>[];
}


const CrudManager = <T extends Record<string, any>>({ title, apiEndpoint, fields }: CrudManagerProps<T>) => {
    const [data, setData] = useState<T[]>([]);
    const [form, setForm] = useState<Partial<T>>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetch(apiEndpoint)
            .then((res) => res.json())
            .then(setData);
    }, [apiEndpoint]);

    const handleInputChange = (key: keyof T, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const saveData = () => {
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `${apiEndpoint}/${editingId}` : apiEndpoint;

        fetch(url, {
            ...getFetchOptions(),
            method,
            body: JSON.stringify(form),
        })
            .then((res) => res.json())
            .then(() => {
                setEditingId(null);
                setForm({});
                setModalOpen(false);
                fetch(apiEndpoint).then((res) => res.json()).then(setData);
            });
    };

    const deleteData = (id: number) => {
        fetch(`${apiEndpoint}/${id}`,
            {
                ...getFetchOptions(),
                method: "DELETE"
            })
            .then(() => {
                setData((prev) => prev.filter((item) => item.id !== id));
            });
    };

    return (
        <div>
            <h1>{title}</h1>
            <table>
                <thead>
                <tr>
                    {fields.map((field) => (
                        <th key={field.name as string}>{field.label}</th>
                    ))}
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {fields.map((field) => (
                            <td key={field.name as string}>{(item[field.name] as string) || "-"}</td>
                        ))}
                        <td>
                            <button onClick={() => { setForm(item); setEditingId(item.id); }}>Edit</button>
                            <button onClick={() => deleteData(item.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button onClick={() => { setForm({}); setEditingId(null); setModalOpen(true); }}>Create New</button>

            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <h2>{editingId ? "Edit" : "Create"} {title}</h2>
                    <form onSubmit={(e) => { e.preventDefault(); saveData(); }}>
                        {fields.map((field) => (
                            <div key={field.name}>
                                <label>{field.label}</label>
                                <input
                                    type={field.type}
                                    value={form[field.name] as string || ""}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                />
                            </div>
                        ))}
                        <button type="submit">Save</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default CrudManager;
