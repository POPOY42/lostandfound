import {
  CiUser,
  CiLock,
  CiRead,
  CiHeadphones,
  CiCircleInfo,
  CiPen,
} from "react-icons/ci";

import { HiOutlineUserGroup } from "react-icons/hi";
import "../../styles/settings.css";

import ChangeUsernameModal from "../../components/settings/ChangeUsernameModal";
import ChangePasswordModal from "../../components/settings/ChangePasswordModal";
import UserGuide from "../../components/settings/UserGuide";
import ContactSupport from  "../../components/settings/ContactSupport";
import Developers from "../../components/settings/Developers";
import { useState } from "react";

const Settings = () => {
    const [activeModal, setActiveModal] = useState(null)


    function openModal(modal){
        setActiveModal(modal)
    }

    function closeModal(){
        setActiveModal(null)
    }

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="settings-wrapper">
            <div className="settings-header">
                <h1>Settings</h1>
                <small>
                    Manage your account and system preferences
                </small>
            </div>

            <div className="settings-box">

                {/* Account Settings */}
                <div className="settings-card">
                    <div className="settings-card-info">
                    <CiUser className="card-icon" />

                    <h3>Account Settings</h3>

                    <small>
                        Manage your admin account
                        <br />
                        information.
                    </small>
                    </div>

                    <div className="settings-card-actions">
                        <button className="settings-btn" onClick={() => openModal("username")}>
                            <CiUser />
                            Change Username
                        </button>

                        <button className="settings-btn" onClick={() => openModal("password")}>
                            <CiLock />
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Help & Support */}
                <div className="settings-card">
                    <div className="settings-card-info">
                        <CiRead className="card-icon" />

                        <h3>Help & Support</h3>

                        <small>
                            Get guidance or reach out
                            <br />
                            to our support team.
                        </small>
                    </div>

                    <div className="settings-card-actions settings-links">
                        <button
                            className="settings-btn"
                            onClick={() => openModal("guide")}
                        >
                            <CiRead />
                            User Guide
                        </button>

                        <hr className="divider" />

                        <button
                            className="settings-btn"
                            onClick={() => openModal("support")}
                        >
                            <CiHeadphones />
                            Contact Support
                        </button>
                    </div>
                </div>

                {/* About System */}
                <div className="settings-card">
                    <div className="settings-card-info">
                        <CiCircleInfo className="card-icon" />

                        <h3>About System</h3>

                        <small>
                            View version details and
                            <br />
                            the development team.
                        </small>
                    </div>

                    <div className="settings-card-actions">
                        <span className="version-badge">
                            Version 1.0.0
                        </span>

                        <div className="settings-links">

                            <button
                                className="settings-btn"
                                onClick={() => openModal("developer")}
                            >
                                <HiOutlineUserGroup />
                                Developer/s
                            </button>
                            <hr className="divider" />
                        </div>
                    </div>
                </div>
            </div>

            {activeModal === "username" && (
                <ChangeUsernameModal onClose={closeModal} currentUsername={user.username}/>
            )} 
            {activeModal === "password" && (
                <ChangePasswordModal onClose={closeModal}/>
            )} 
            {activeModal === "guide" && (
                <UserGuide onClose={closeModal}/>
            )} 
            {activeModal === "support" && (
                <ContactSupport onClose={closeModal}/>
            )}
            {activeModal === "developer" && (
                <Developers onClose={closeModal}/>
            )}
        </div>
    );

};

export default Settings;