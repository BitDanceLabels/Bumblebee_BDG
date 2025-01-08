// import { useEffect, useState } from "react";
// import styled from "styled-components";
// import axios from "axios";

// const Container = styled.div`
//   padding: 20px;
// `;

// const TableWrapper = styled.div`
//   margin-top: 20px;
// `;

// const TableTitle = styled.h3`
//   text-align: center;
//   margin-bottom: 20px;
//   font-size: 1.8rem;
//   color: #007bff;
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-bottom: 20px;

//   th,
//   td {
//     padding: 16px;
//     text-align: left;
//     border-bottom: 1px solid #ddd;
//     font-size: 1.4rem;
//   }

//   th {
//     background-color: #f1f1f1;
//   }

//   tr:hover {
//     background-color: #f9f9f9;
//   }

//   input {
//     width: 100%;
//     padding: 8px;
//     border: 1px solid #ddd;
//     border-radius: 4px;
//     font-size: 1.2rem;
//   }
// `;

// const ActionButton = styled.button`
//   padding: 8px 12px;
//   margin: 0 5px;
//   cursor: pointer;
//   background-color: ${(props) => (props.danger ? "#dc3545" : "#007bff")};
//   color: #fff;
//   border: none;
//   border-radius: 4px;
//   font-weight: 600;

//   &:hover {
//     background-color: ${(props) => (props.danger ? "#c82333" : "#0056b3")};
//   }
// `;

// const FormWrapper = styled.div`
//   margin-bottom: 20px;
//   padding: 20px;
//   background-color: #f9f9f9;
//   border-radius: 8px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

//   h3 {
//     text-align: center;
//     margin-bottom: 20px;
//     color: #007bff;
//   }

//   label {
//     display: block;
//     margin-bottom: 8px;
//     font-size: 1.2rem;
//     font-weight: bold;
//     color: #333;
//   }

//   input {
//     width: 100%;
//     padding: 8px;
//     border: 1px solid #ddd;
//     border-radius: 4px;
//     font-size: 1.2rem;
//     margin-bottom: 16px;
//   }
// `;

// const ClassInManager = () => {
//     const [accounts, setAccounts] = useState([]);
//     const [newAccount, setNewAccount] = useState({
//         account_name: "",
//         account_user_name: "",
//         account_password: "",
//         registration_date: "",
//         expiry_date: "",
//         created_by: 1,
//         created_by_name: "Admin",
//         created_by_date: new Date().toISOString(),
//     });

//     const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

//     const fullData = JSON.parse(localStorage.getItem("fullData"));
//     let token = "";
//     if (fullData) {
//         token = fullData.access_token;
//     }

//     useEffect(() => {
//         fetchAccounts();
//     }, []);

//     const fetchAccounts = async () => {
//         try {
//             const response = await axios.get(`${API_BASE_URL}/api/account_classin`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setAccounts(response.data);
//         } catch (error) {
//             console.error("Error fetching accounts:", error);
//         }
//     };

//     const handleAddAccount = async () => {
//         try {
//             await axios.post(`${API_BASE_URL}/api/account_classin`, newAccount, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             });
//             fetchAccounts();
//             setNewAccount({
//                 account_name: "",
//                 account_user_name: "",
//                 account_password: "",
//                 registration_date: "",
//                 expiry_date: "",
//                 created_by: 1,
//                 created_by_name: "Admin",
//                 created_by_date: new Date().toISOString(),
//             });
//         } catch (error) {
//             console.error("Error adding account:", error);
//         }
//     };

//     const handleUpdateAccount = async (account) => {
//         try {
//             await axios.put(
//                 `${API_BASE_URL}/api/account_classin/${account.account_classin_id}`,
//                 account,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//             fetchAccounts();
//         } catch (error) {
//             console.error("Error updating account:", error);
//         }
//     };

//     const handleDeleteAccount = async (accountId) => {
//         try {
//             await axios.delete(`${API_BASE_URL}/api/account_classin/${accountId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             fetchAccounts();
//         } catch (error) {
//             console.error("Error deleting account:", error);
//         }
//     };

//     const handleFieldChange = (accountId, field, value) => {
//         setAccounts(
//             accounts.map((account) =>
//                 account.account_classin_id === accountId
//                     ? { ...account, [field]: value }
//                     : account
//             )
//         );
//     };

//     return (
//         <Container>
//             <FormWrapper>
//                 <h3>Create New Account</h3>
//                 <label>Account Name</label>
//                 <input
//                     type="text"
//                     placeholder="Account Name"
//                     value={newAccount.account_name}
//                     onChange={(e) =>
//                         setNewAccount({ ...newAccount, account_name: e.target.value })
//                     }
//                 />
//                 <label>Username</label>
//                 <input
//                     type="text"
//                     placeholder="Username"
//                     value={newAccount.account_user_name}
//                     onChange={(e) =>
//                         setNewAccount({ ...newAccount, account_user_name: e.target.value })
//                     }
//                 />
//                 <label>Password</label>
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={newAccount.account_password}
//                     onChange={(e) =>
//                         setNewAccount({ ...newAccount, account_password: e.target.value })
//                     }
//                 />
//                 <label>Registration Date</label>
//                 <input
//                     type="date"
//                     placeholder="Registration Date"
//                     value={newAccount.registration_date}
//                     onChange={(e) =>
//                         setNewAccount({ ...newAccount, registration_date: e.target.value })
//                     }
//                 />
//                 <label>Expiry Date</label>
//                 <input
//                     type="date"
//                     placeholder="Expiry Date"
//                     value={newAccount.expiry_date}
//                     onChange={(e) =>
//                         setNewAccount({ ...newAccount, expiry_date: e.target.value })
//                     }
//                 />
//                 <ActionButton onClick={handleAddAccount}>Add Account</ActionButton>
//             </FormWrapper>

//             <TableWrapper>
//                 <TableTitle>ClassIn Accounts</TableTitle>
//                 <Table>
//                     <thead>
//                         <tr>
//                             <th>Account Name</th>
//                             <th>Username</th>
//                             <th>Password</th>
//                             <th>Registration Date</th>
//                             <th>Expiry Date</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {accounts.length === 0 ? (
//                             <tr>
//                                 <td colSpan="6">No Data Available</td>
//                             </tr>
//                         ) : (
//                             accounts.map((account) => (
//                                 <tr key={account.account_classin_id}>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             value={account.account_name}
//                                             onChange={(e) =>
//                                                 handleFieldChange(
//                                                     account.account_classin_id,
//                                                     "account_name",
//                                                     e.target.value
//                                                 )
//                                             }
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             value={account.account_user_name}
//                                             onChange={(e) =>
//                                                 handleFieldChange(
//                                                     account.account_classin_id,
//                                                     "account_user_name",
//                                                     e.target.value
//                                                 )
//                                             }
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="password"
//                                             value={account.account_password}
//                                             onChange={(e) =>
//                                                 handleFieldChange(
//                                                     account.account_classin_id,
//                                                     "account_password",
//                                                     e.target.value
//                                                 )
//                                             }
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="date"
//                                             value={account.registration_date?.split("T")[0]}
//                                             onChange={(e) =>
//                                                 handleFieldChange(
//                                                     account.account_classin_id,
//                                                     "registration_date",
//                                                     e.target.value
//                                                 )
//                                             }
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="date"
//                                             value={account.expiry_date?.split("T")[0]}
//                                             onChange={(e) =>
//                                                 handleFieldChange(
//                                                     account.account_classin_id,
//                                                     "expiry_date",
//                                                     e.target.value
//                                                 )
//                                             }
//                                         />
//                                     </td>
//                                     <td>
//                                         <ActionButton onClick={() => handleUpdateAccount(account)}>
//                                             Save
//                                         </ActionButton>
//                                         <ActionButton
//                                             danger
//                                             onClick={() =>
//                                                 handleDeleteAccount(account.account_classin_id)
//                                             }
//                                         >
//                                             Delete
//                                         </ActionButton>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </Table>
//             </TableWrapper>
//         </Container>
//     );
// };

// export default ClassInManager;

import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  padding: 20px;
`;

const TableWrapper = styled.div`
  margin-top: 20px;
`;

const TableTitle = styled.h3`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #007bff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th,
  td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    font-size: 1.4rem;
  }

  th {
    background-color: #f1f1f1;
  }

  tr:hover {
    background-color: #f9f9f9;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1.2rem;
  }
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  margin: 0 5px;
  cursor: pointer;
  background-color: ${(props) => (props.danger ? "#dc3545" : "#007bff")};
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: 600;

  &:hover {
    background-color: ${(props) => (props.danger ? "#c82333" : "#0056b3")};
  }
`;

const FormWrapper = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #007bff;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1.2rem;
    margin-bottom: 16px;
  }
`;

const ClassInManager = () => {
    const [accounts, setAccounts] = useState([]);
    const [newAccount, setNewAccount] = useState({
        account_name: "",
        account_user_name: "",
        account_password: "",
        registration_date: "",
        expiry_date: "",
        created_by: 1,
        created_by_name: "Admin",
        created_by_date: new Date().toISOString(),
    });

    const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

    const fullData = JSON.parse(localStorage.getItem("fullData"));
    let token = "";
    if (fullData) {
        token = fullData.access_token;
    }

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/account_classin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAccounts(response.data);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };

    const handleAddAccount = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/account_classin`, newAccount, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            fetchAccounts();
            setNewAccount({
                account_name: "",
                account_user_name: "",
                account_password: "",
                registration_date: "",
                expiry_date: "",
                created_by: 1,
                created_by_name: "Admin",
                created_by_date: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error adding account:", error);
        }
    };

    const handleUpdateAccount = async (account) => {
        try {
            await axios.put(
                `${API_BASE_URL}/api/account_classin/${account.account_classin_id}`,
                account,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            fetchAccounts();
        } catch (error) {
            console.error("Error updating account:", error);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/account_classin/${accountId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchAccounts();
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    const handleFieldChange = (accountId, field, value) => {
        setAccounts(
            accounts.map((account) =>
                account.account_classin_id === accountId
                    ? { ...account, [field]: value }
                    : account
            )
        );
    };

    return (
        <Container>
            <FormWrapper>
                <h3>Create New Account</h3>
                <label>Account Name</label>
                <input
                    type="text"
                    placeholder="Account Name"
                    value={newAccount.account_name}
                    onChange={(e) =>
                        setNewAccount({ ...newAccount, account_name: e.target.value })
                    }
                />
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Username"
                    value={newAccount.account_user_name}
                    onChange={(e) =>
                        setNewAccount({ ...newAccount, account_user_name: e.target.value })
                    }
                />
                <label>Password</label>
                <input
                    type="text" // Đổi thành text để hiển thị mật khẩu
                    placeholder="Password"
                    value={newAccount.account_password}
                    onChange={(e) =>
                        setNewAccount({ ...newAccount, account_password: e.target.value })
                    }
                />
                <label>Registration Date</label>
                <input
                    type="date"
                    placeholder="Registration Date"
                    value={newAccount.registration_date}
                    onChange={(e) =>
                        setNewAccount({ ...newAccount, registration_date: e.target.value })
                    }
                />
                <label>Expiry Date</label>
                <input
                    type="date"
                    placeholder="Expiry Date"
                    value={newAccount.expiry_date}
                    onChange={(e) =>
                        setNewAccount({ ...newAccount, expiry_date: e.target.value })
                    }
                />
                <ActionButton onClick={handleAddAccount}>Add Account</ActionButton>
            </FormWrapper>

            <TableWrapper>
                <TableTitle>ClassIn Accounts</TableTitle>
                <Table>
                    <thead>
                        <tr>
                            <th>Account Name</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Registration Date</th>
                            <th>Expiry Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.length === 0 ? (
                            <tr>
                                <td colSpan="6">No Data Available</td>
                            </tr>
                        ) : (
                            accounts.map((account) => (
                                <tr key={account.account_classin_id}>
                                    <td>
                                        <input
                                            type="text"
                                            value={account.account_name}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    account.account_classin_id,
                                                    "account_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={account.account_user_name}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    account.account_classin_id,
                                                    "account_user_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text" // Đổi thành text để hiển thị mật khẩu
                                            value={account.account_password}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    account.account_classin_id,
                                                    "account_password",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={account.registration_date?.split("T")[0]}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    account.account_classin_id,
                                                    "registration_date",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={account.expiry_date?.split("T")[0]}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    account.account_classin_id,
                                                    "expiry_date",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <ActionButton onClick={() => handleUpdateAccount(account)}>
                                            Save
                                        </ActionButton>
                                        <ActionButton
                                            danger
                                            onClick={() =>
                                                handleDeleteAccount(account.account_classin_id)
                                            }
                                        >
                                            Delete
                                        </ActionButton>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </TableWrapper>
        </Container>
    );
};

export default ClassInManager;