import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
    Upload, FileSpreadsheet, CheckCircle2,
    AlertTriangle, Loader2, UserPlus, Trash2
} from 'lucide-react';
import { UniqueIdService } from '../../services/UniqueIdService';
import './DataImport.css';

interface ImportedStudent {
    id: string;
    name: string;
    email: string;
    school: string;
    status: 'valid' | 'invalid' | 'duplicate';
}

const DataImport: React.FC = () => {
    const [students, setStudents] = useState<ImportedStudent[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [successCount, setSuccessCount] = useState(0);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws) as any[];

                const mapped: ImportedStudent[] = data.map((item: any) => ({
                    id: UniqueIdService.generateStudentId(),
                    name: item.Nome || item.name || 'N/A',
                    email: item.Email || item.email || 'N/A',
                    school: item.Escola || item.school || 'N/A',
                    status: (item.Nome && item.Email) ? 'valid' : 'invalid'
                }));

                setStudents(mapped);
                setSuccessCount(mapped.filter(s => s.status === 'valid').length);
            } catch (err) {
                console.error('Erro ao ler arquivo:', err);
            } finally {
                setIsUploading(false);
            }
        };

        reader.readAsBinaryString(file);
    };

    const finalizeImport = () => {
        // Mock finalizing to database
        alert(`${successCount} alunos importados com sucesso!`);
        setStudents([]);
        setSuccessCount(0);
    };

    return (
        <div className="import-container glass-card">
            <div className="import-header">
                <div className="title-area">
                    <UserPlus size={24} color="var(--primary)" />
                    <div>
                        <h3>Importação em Massa</h3>
                        <p>Carregue arquivos .xlsx ou .csv para cadastrar alunos rapidamente.</p>
                    </div>
                </div>
                <div className="import-actions">
                    <label className="neon-button primary upload-label">
                        <Upload size={18} /> SELECIONAR ARQUIVO
                        <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} hidden />
                    </label>
                </div>
            </div>

            <div className="import-content">
                {isUploading ? (
                    <div className="import-loading">
                        <Loader2 className="spinner" size={48} />
                        <p>Processando planilha...</p>
                    </div>
                ) : students.length > 0 ? (
                    <div className="import-results">
                        <div className="results-summary">
                            <div className="summary-item">
                                <span className="val">{students.length}</span>
                                <span className="lab">TOTAL LIDO</span>
                            </div>
                            <div className="summary-item success">
                                <span className="val">{successCount}</span>
                                <span className="lab">VÁLIDOS</span>
                            </div>
                            <div className="summary-item danger">
                                <span className="val">{students.length - successCount}</span>
                                <span className="lab">ERROS</span>
                            </div>
                        </div>

                        <div className="import-table-wrapper">
                            <table className="import-table">
                                <thead>
                                    <tr>
                                        <th>ID GERADO</th>
                                        <th>NOME</th>
                                        <th>EMAIL</th>
                                        <th>ESCOLA</th>
                                        <th>STATUS</th>
                                        <th>AÇÕES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s, i) => (
                                        <tr key={i} className={s.status}>
                                            <td className="id-cell">{s.id}</td>
                                            <td>{s.name}</td>
                                            <td>{s.email}</td>
                                            <td>{s.school}</td>
                                            <td>
                                                <span className={`status-badge ${s.status}`}>
                                                    {s.status === 'valid' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                                                    {s.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="delete-row" onClick={() => setStudents(prev => prev.filter((_, idx) => idx !== i))}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="import-footer">
                            <button className="neon-button alt" onClick={() => setStudents([])}>DESCARTAR</button>
                            <button className="neon-button primary" disabled={successCount === 0} onClick={finalizeImport}>
                                CONFIRMAR IMPORTAÇÃO
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="import-empty">
                        <FileSpreadsheet size={64} opacity={0.1} />
                        <p>Arraste uma planilha ou clique em Selecionar Arquivo</p>
                        <div className="format-hints">
                            <span>Colunas aceitas: Nome, Email, Escola</span>
                            <span>Formatos: .xlsx, .csv</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataImport;
