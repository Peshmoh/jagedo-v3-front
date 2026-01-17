import React from 'react';
// Import icons for each section
import { FiFileText, FiShare2, FiShield, FiUserCheck, FiMessageSquare, FiTrendingUp, FiSettings } from 'react-icons/fi';

const PrivacyPolicy: React.FC = () => (
    // 1. Full-screen container with a subtle gradient background
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">

        {/* 2. Main content card with a modern look */}
        <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    Privacy Policy
                </h1>
                <p className="mt-3 text-base text-gray-500">
                    Your trust is our top priority.
                </p>
            </div>

            {/* Content Sections with Icons */}
            <div className="space-y-10">
                <Section icon={<FiFileText />} title="Our Commitment to Privacy">
                    Your privacy is important to us. This page outlines our policy regarding the collection, use, and protection of your personal information when you use our services.
                </Section>
                <Section icon={<FiShare2 />} title="Information Collection and Use">
                    We collect several different types of information, such as your name and email, to provide and improve our service to you.
                </Section>
                <Section icon={<FiTrendingUp />} title="How We Use Your Information">
                    The information we collect is used to personalize your experience, improve our services, and communicate with you about updates.
                </Section>
                <Section icon={<FiShield />} title="Data Protection and Security">
                    We implement industry-standard security measures to maintain the safety of your personal data and protect it from unauthorized access.
                </Section>
                <Section icon={<FiSettings />} title="Cookies and Tracking Technologies">
                    Our website may use "cookies" to enhance user experience. You have the option to either accept or refuse these cookies.
                </Section>
                <Section icon={<FiUserCheck />} title="Changes to This Policy">
                    We may update our Privacy Policy from time to time. You are advised to review this page periodically for any changes.
                </Section>
                <Section icon={<FiMessageSquare />} title="Contact Us">
                    If you have any questions, please contact us at{' '}
                    <a href="mailto:privacy@example.com" className="text-blue-600 font-medium hover:underline">
                        privacy@example.com
                    </a>.
                </Section>
            </div>
        </div>
    </div>
);


// Helper component to keep the main code clean
interface SectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ icon, title, children }) => (
    <section className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex-shrink-0 text-3xl text-blue-500 bg-blue-50 rounded-full w-14 h-14 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
            <p className="text-gray-600 leading-relaxed">{children}</p>
        </div>
    </section>
);


export default PrivacyPolicy;