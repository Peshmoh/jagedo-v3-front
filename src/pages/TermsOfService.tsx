import React from 'react';
import { FiCheckSquare, FiCompass, FiUserPlus, FiAward, FiSlash, FiRefreshCw, FiMail } from 'react-icons/fi';

const TermsOfService: React.FC = () => (
    // 1. Full-screen container with a subtle gradient background
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">

        {/* 2. Main content card with a modern look */}
        <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-blue-600">
                    Terms of Service
                </h1>
                <p className="mt-3 text-base text-gray-500">
                    The rules and guidelines for using Jagedo.
                </p>
            </div>

            {/* Content Sections with Icons */}
            <div className="space-y-10">
                <Section icon={<FiCheckSquare />} title="1. Acceptance of Terms">
                    By accessing or using Jagedo, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
                </Section>
                <Section icon={<FiCompass />} title="2. Use of Service">
                    You agree to use Jagedo only for lawful purposes and in accordance with these terms. You must not misuse or attempt to disrupt our service.
                </Section>
                <Section icon={<FiUserPlus />} title="3. Account Registration">
                    You may be required to create an account to use certain features. You are responsible for maintaining the confidentiality of your account information.
                </Section>
                <Section icon={<FiAward />} title="4. Intellectual Property">
                    All content and materials on Jagedo are the property of Jagedo or its licensors. You may not copy, modify, or distribute any content without permission.
                </Section>
                <Section icon={<FiSlash />} title="5. Termination">
                    We reserve the right to suspend or terminate your access to Jagedo at any time, without notice, for conduct that violates these terms.
                </Section>
                <Section icon={<FiRefreshCw />} title="6. Changes to Terms">
                    Jagedo may update these Terms of Service from time to time. Continued use of the service constitutes acceptance of the revised terms.
                </Section>
                <Section icon={<FiMail />} title="7. Contact Us">
                    If you have any questions about these Terms, please contact us at{' '}
                    <a href="mailto:support@jagedo.com" className="text-blue-600 font-medium hover:underline">
                        support@jagedo.com
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


export default TermsOfService;