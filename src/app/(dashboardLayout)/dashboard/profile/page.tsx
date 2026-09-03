"use client";

import Image from "next/image";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
    Camera,
    Link as LinkIcon,
    Mail,
    Phone,
    UserRound,
} from "lucide-react";
import { useUserSession } from "@/hooks/useUserSession";

export default function ProfilePage() {
    const { user, isLoggedIn, isPending } = useUserSession();
    console.log(useUserSession)

    if (isPending) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <p className="text-sm text-gray-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    if (!isLoggedIn || !user) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <p className="text-sm text-gray-500">
                    Please login to view your profile.
                </p>
            </div>
        );
    }

    const userName = user.name || "User";
    const userEmail = user.email || "No email available";
    const userImage = user.image;

    return (
        <div className="mx-auto w-full max-w-5xl">
            {/* =========================================================
                PAGE TITLE
            ========================================================= */}
            <div className="mb-5">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Profile
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your personal information and account settings.
                </p>
            </div>

            {/* =========================================================
                PROFILE CARD
            ========================================================= */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {/* =====================================================
                    PROFILE COVER
                ===================================================== */}
                <div className="relative h-35 overflow-hidden bg-linear-to-r from-emerald-50 via-teal-50 to-cyan-50 sm:h-40">
                    {/* Decorative circles */}
                    <div className="absolute -right-8 -top-16 h-45 w-45 rounded-full bg-emerald-100/50" />

                    <div className="absolute right-20 -top-12 h-35 w-35 rounded-full bg-teal-100/40" />

                    <div className="absolute bottom-[-80px] left-1/3 h-40 w-40 rounded-full bg-white/40" />
                </div>

                {/* =====================================================
                    PROFILE HEADER
                ===================================================== */}
                <div className="relative px-5 pb-5 sm:px-7">
                    <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                        {/* LEFT */}
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md sm:h-28 sm:w-28">
                                    {userImage ? (
                                        <Image
                                            src={userImage}
                                            alt={userName}
                                            width={112}
                                            height={112}
                                            unoptimized
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserRound
                                            size={48}
                                            className="text-gray-400"
                                        />
                                    )}
                                </div>

                                {/* Camera Button */}
                                <button
                                    type="button"
                                    aria-label="Change profile photo"
                                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-white shadow-sm transition-colors hover:bg-primary"
                                >
                                    <Camera size={14} />
                                </button>
                            </div>

                            {/* User Name */}
                            <div className="pb-1">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {userName}
                                </h2>

                                <p className="mt-0.5 text-sm text-gray-500">
                                    Customer
                                </p>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <button
                            type="button"
                            className="w-fit rounded-md bg-primary px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* =====================================================
                    TABS
                ===================================================== */}
                <Tabs>
                    <TabList className="flex overflow-x-auto border-t border-gray-200 px-5 sm:px-7">
                        <Tab
                            className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-xs font-medium text-gray-500 outline-none transition-colors first:pl-0"
                            selectedClassName="!border-primary !text-primary"
                        >
                            About Me
                        </Tab>

                        <Tab
                            className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-xs font-medium text-gray-500 outline-none transition-colors"
                            selectedClassName="!border-primary !text-primary"
                        >
                            Account
                        </Tab>

                        <Tab
                            className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-xs font-medium text-gray-500 outline-none transition-colors"
                            selectedClassName="!border-primary !text-primary"
                        >
                            Preferences
                        </Tab>

                        <Tab
                            className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-xs font-medium text-gray-500 outline-none transition-colors"
                            selectedClassName="!border-primary !text-primary"
                        >
                            Notifications
                        </Tab>
                    </TabList>

                    {/* =================================================
                        ABOUT ME
                    ================================================= */}
                    <TabPanel className="p-5 outline-none sm:p-7">
                        <div className="grid gap-5 lg:grid-cols-2">
                            {/* FULL NAME */}
                            <ProfileField
                                label="Full Name"
                                value={userName}
                            />

                            {/* EMAIL */}
                            <ProfileField
                                label="Email"
                                value={userEmail}
                            />

                            {/* USERNAME */}
                            <ProfileField
                                label="Username"
                                value={
                                    user.name
                                        ? user.name
                                              .toLowerCase()
                                              .replace(/\s+/g, "")
                                        : "username"
                                }
                            />

                            {/* PHONE */}
                            {/* <ProfileField
                                label="Phone"
                                value={user.phone || "Not added yet"}
                            /> */}

                            {/* LOCATION */}
                            <ProfileField
                                label="Location"
                                value="Bangladesh"
                            />

                            {/* BIO */}
                            <div className="lg:col-span-2">
                                <label className="mb-2 block text-xs font-medium text-gray-600">
                                    Bio
                                </label>

                                <textarea
                                    rows={4}
                                    defaultValue="Tell us something about yourself..."
                                    className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* SOCIAL LINKS */}
                        <div className="mt-6 flex items-center gap-3">
                            <SocialButton
                                icon={<LinkIcon size={15} />}
                                label="Website"
                            />

                            <SocialButton
                                icon={<Mail size={15} />}
                                label="Email"
                            />

                            <SocialButton
                                icon={<Phone size={15} />}
                                label="Phone"
                            />
                        </div>
                    </TabPanel>

                    {/* =================================================
                        ACCOUNT
                    ================================================= */}
                    <TabPanel className="p-5 outline-none sm:p-7">
                        <div className="max-w-2xl">
                            <h3 className="text-base font-semibold text-gray-900">
                                Account Information
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Your account information and login details.
                            </p>

                            <div className="mt-5 space-y-4">
                                <InfoRow
                                    icon={<UserRound size={18} />}
                                    label="Name"
                                    value={userName}
                                />

                                <InfoRow
                                    icon={<Mail size={18} />}
                                    label="Email"
                                    value={userEmail}
                                />

                                {/* <InfoRow
                                    icon={<Phone size={18} />}
                                    label="Phone"
                                    value={user.phone || "Not added yet"}
                                /> */}
                            </div>
                        </div>
                    </TabPanel>

                    {/* =================================================
                        PREFERENCES
                    ================================================= */}
                    <TabPanel className="p-5 outline-none sm:p-7">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Preferences
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Manage your account preferences.
                            </p>

                            <div className="mt-5 space-y-4">
                                <PreferenceRow
                                    title="Email Updates"
                                    description="Receive important updates about your account."
                                />

                                <PreferenceRow
                                    title="Order Notifications"
                                    description="Get notified when your order status changes."
                                />

                                <PreferenceRow
                                    title="Promotional Emails"
                                    description="Receive special offers and promotions."
                                />
                            </div>
                        </div>
                    </TabPanel>

                    {/* =================================================
                        NOTIFICATIONS
                    ================================================= */}
                    <TabPanel className="p-5 outline-none sm:p-7">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Notifications
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Choose how you want to receive notifications.
                            </p>

                            <div className="mt-5 space-y-4">
                                <PreferenceRow
                                    title="Order Updates"
                                    description="Notifications about your orders."
                                />

                                <PreferenceRow
                                    title="Wishlist Updates"
                                    description="Get notified about wishlist changes."
                                />

                                <PreferenceRow
                                    title="Account Activity"
                                    description="Security and account activity notifications."
                                />
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}

/* =============================================================
   PROFILE FIELD
============================================================= */

function ProfileField({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
                {label}
            </label>

            <input
                type="text"
                defaultValue={value}
                className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary"
            />
        </div>
    );
}

/* =============================================================
   SOCIAL BUTTON
============================================================= */

function SocialButton({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary hover:text-white"
        >
            {icon}
        </button>
    );
}

/* =============================================================
   INFO ROW
============================================================= */

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>

                <p className="truncate text-sm font-medium text-gray-800">
                    {value}
                </p>
            </div>
        </div>
    );
}

/* =============================================================
   PREFERENCE ROW
============================================================= */

function PreferenceRow({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4">
            <div>
                <h4 className="text-sm font-medium text-gray-800">
                    {title}
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                    {description}
                </p>
            </div>

            <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input
                    type="checkbox"
                    defaultChecked
                    className="peer sr-only"
                />

                <div className="h-5 w-9 rounded-full bg-gray-200 transition-colors peer-checked:bg-primary" />

                <div className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
            </label>
        </div>
    );
}