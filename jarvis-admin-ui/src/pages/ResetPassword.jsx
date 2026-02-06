// import { useSearchParams } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import "../styles/resetPassword.css";
//
// const ResetPassword = () => {
//     const [params] = useSearchParams();
//     const token = params.get("token");
//
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//
//     const handleResetPassword = async () => {
//         if (!password || password.length < 6) {
//             alert("Password must be at least 6 characters");
//             return;
//         }
//
//         try {
//             setLoading(true);
//
//             const res = await axios.post(
//                 "http://localhost:8080/api/auth/reset-password",
//                 {
//                     token,
//                     newPassword: password,
//                 }
//             );
//
//             alert(res.data.message || "Password reset successful");
//         } catch (err) {
//             console.error(err);
//             alert(
//                 err.response?.data?.message ||
//                 "Reset password failed"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     if (!token) {
//         return (
//             <div className="reset-container">
//                 <div className="reset-card">
//                     <h2>Invalid Link</h2>
//                     <p>This reset link is invalid or expired.</p>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="reset-container">
//             <div className="reset-card">
//                 <h2>Reset Password</h2>
//                 <p>Enter your new password below</p>
//
//                 <input
//                     type="password"
//                     className="reset-input"
//                     placeholder="New password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//
//                 <button
//                     className="reset-btn"
//                     onClick={handleResetPassword}
//                     disabled={loading}
//                 >
//                     {loading ? "Resetting..." : "Reset Password"}
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// export default ResetPassword;
