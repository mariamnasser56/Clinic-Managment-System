import React, { useContext, useState } from "react";
import { CiStethoscope } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { GrLogout } from "react-icons/gr";
import AuthContext from "../store/AuthContext";

function NavBar() {
  const [showMenu, setshowMenu] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="flex h-20 m-0 items-center px-6 justify-between py-5  border-b-gray-200 border-b-1 shadow-blue-200 bg-white shadow-sm fixed z-100 w-full ">
        <Link to={""}>
          <div className="flex items-center">
            <CiStethoscope className="text-4xl text-sky-500" />
            <h1 className="font-semibold text-2xl text-blue-950 cursor-pointer  ">
              MediCore
            </h1>
          </div>
        </Link>

        <div className="flex justify-between items-center ">
          <ul className="hidden md:flex gap-5 cursor-pointer ">
            <Link to={""}>
              <li className="hover:text-sky-500 duration-200">Home</li>
            </Link>
            <Link to={"doctors-list"}>
              <li className="hover:text-sky-500 duration-200">Doctors</li>
            </Link>
            <Link to={"my-bookings"}>
              <li className="hover:text-sky-500 duration-200">
                My Appointments
              </li>
            </Link>
          </ul>
        </div>
        <div className="flex gap-4">
          <Link to={"doctors-list"}>
            <button className="cursor-pointer hidden  md:block bg-sky-500 text-amber-50 rounded-3xl p-2 hover:bg-[#1477b8] duration-200">
              Book Appointment
            </button>
          </Link>

          <button onClick={handleLogout} className="flex items-center">
            <GrLogout className="text-3xl text-sky-500 cursor-pointer" />
          </button>
        </div>

        <div className="text-3xl md:hidden cursor-pointer flex items-center">
          {!showMenu ? (
            <RxHamburgerMenu onClick={() => setshowMenu(true)} />
          ) : (
            <img
              src="/assets/icon-close.svg"
              alt="Close menu"
              className="w-6 h-6"
              onClick={() => setshowMenu(false)}
            />
          )}
        </div>
      </div>

      {/* ---------------- Mobile View -------------------- */}
      {showMenu && (
        <div className="fixed top-20 left-0 w-full z-50 md:hidden bg-white shadow-lg flex flex-col p-4 rounded-b-sm">
          <div className="flex flex-col gap-2 justify-center items-center">
            <Link to={""} className="hover:text-sky-500">
              Home
            </Link>
            <Link to={"doctors-list"} className="hover:text-sky-500">
              Doctors
            </Link>
            <Link to={"my-bookings"} className="hover:text-sky-500">
              My Appointments
            </Link>
            <Link to={"doctors-list"}>
              <button className="bg-sky-500 text-white rounded-3xl px-4 py-2 hover:opacity-80">
                Book Appointment
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
