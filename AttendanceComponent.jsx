import React, { useState } from 'react';

const AttendanceComponent = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Sabari', status: '' },
    { id: 2, name: 'Niranjan', status: '' },
    { id: 3, name: 'Tharaneswaran', status: '' },
  ]);

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceLog, setAttendanceLog] = useState([]);

  const handleStatusChange = (id, status) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLog = {
      date,
      records: students.map(({ id, name, status }) => ({ id, name, status })),
    };

    setAttendanceLog(prev => [...prev, newLog]);

    // Reset status for next day
    setStudents(prev => prev.map(student => ({ ...student, status: '' })));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="font-semibold mr-2">Date:</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        <table className="table-auto w-full mb-4 border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td className="p-2 border">{student.name}</td>
                <td className="p-2 border">
                  <select
                    value={student.status}
                    onChange={e => handleStatusChange(student.id, e.target.value)}
                    className="border px-2 py-1"
                  >
                    <option value="">Select</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Attendance
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Attendance Records</h3>
      {attendanceLog.length === 0 ? (
        <p>No records yet.</p>
      ) : (
        <div className="overflow-auto">
          {attendanceLog.map((log, index) => (
            <div key={index} className="mb-4 border p-3 rounded bg-gray-50">
              <h4 className="font-bold mb-2">Date: {log.date}</h4>
              <table className="table-auto w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Student</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {log.records.map(record => (
                    <tr key={record.id}>
                      <td className="p-2 border">{record.name}</td>
                      <td className="p-2 border">{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceComponent;
