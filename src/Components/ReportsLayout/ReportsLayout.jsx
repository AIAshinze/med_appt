import './ReportsLayout.css';

// Reports are PDFs stored in the React project's public folder
const DEFAULT_REPORTS = [
    {
        id: 'patient-report',
        title: 'Patient report',
        description: 'Consultation summary and recommendations',
        url: '/patient_report.pdf',
        fileName: 'patient_report.pdf',
    },
];

const ReportsLayout = ({ reports = DEFAULT_REPORTS }) => {
    return (
        <section className="reports-container" aria-labelledby="reports-heading">
            <h1 id="reports-heading">Your reports</h1>

            {reports.length === 0 ? (
                <p className="reports-empty">
                    You have no reports yet. Reports appear here after your consultations.
                </p>
            ) : (
                <div className="reports-table-wrap">
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th scope="col">Report</th>
                                <th scope="col">Description</th>
                                <th scope="col">
                                    <span className="visually-hidden">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id}>
                                    <td className="reports-title">{report.title}</td>
                                    <td>{report.description}</td>
                                    <td className="reports-actions">
                                        {/* Open the report in a new tab */}
                                        <a href={report.url} target="_blank" rel="noopener noreferrer">
                                            View
                                            <span className="visually-hidden"> {report.title}</span>
                                        </a>
                                        {/* The download attribute saves the file instead of navigating */}
                                        <a href={report.url} download={report.fileName}>
                                            Download
                                            <span className="visually-hidden"> {report.title}</span>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default ReportsLayout;