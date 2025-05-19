import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import Logo from '/public/images/lc.png';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    useEffect(() => {
        if (user) {
            const dashboardRoute =
                user.role === 'admin'
                    ? route('admin.dashboard')
                    : user.role === 'coordinator'
                      ? route('coordinator.dashboard')
                      : route('student.dashboard');
            router.visit(dashboardRoute);
        }
    }, [user]);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[url('/public/images/lcbg.png')] bg-cover bg-center bg-no-repeat p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {!user && (
                            <>
                                <Link
                                    href={route('login')}
                                    className="bg-primary hover:bg-primary/80 inline-block rounded-sm border px-5 py-1.5 text-sm leading-normal text-white transition-colors duration-200 ease-linear dark:text-[#EDEDEC] dark:hover:bg-[#3E3E3A] dark:hover:text-[#EDEDEC]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-primary hover:bg-primary/80 inline-block rounded-sm border px-5 py-1.5 text-sm leading-normal text-white transition-colors duration-200 ease-linear dark:text-[#EDEDEC] dark:hover:bg-[#3E3E3A] dark:hover:text-[#EDEDEC]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 text-xl font-bold">Lemery Colleges On-the-Job Training Hours Tracking System</h1>
                            <p className="text-[#4a4a4a] dark:text-[#C1C1C1]">
                                This system allows administrators, coordinators, and students to efficiently log and monitor the number of OJT hours
                                rendered. It ensures transparency, accuracy, and real-time tracking to improve the internship experience.
                            </p>
                        </div>

                        <div className="bg-primary/25 relative -mb-px flex aspect-[335/376] w-full shrink-0 items-center justify-center overflow-hidden rounded-t-lg lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg">
                            <img src={Logo} alt="logo" className="w-56" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
