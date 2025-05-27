import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import * as faceapi from 'face-api.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Records',
        href: '/student/time-records',
    },
    {
        title: 'Time In',
        href: '/student/time-records/time-in',
    },
];

export default function TimeIn() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isWebcamReady, setIsWebcamReady] = useState(false);

    const loadModels = useCallback(() => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]).then(() => detectFace());
    }, []);

    const detectFace = useCallback(async () => {
        if (!webcamRef.current || !webcamRef.current.video || !isWebcamReady) return;

        const detections = await faceapi
            .detectAllFaces(webcamRef.current.video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (canvasRef.current) {
            const displaySize = { width: 940, height: 650 };
            faceapi.matchDimensions(canvasRef.current, displaySize);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        }

        if (detections.length > 0) {
            const faceData = {
                descriptor: Array.from(detections[0].descriptor),
            };

            // Compare with stored face
            setIsProcessing(true);
            try {
                router.post(route('student.face-recognition.compare'), faceData, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const flash = page.props.flash as { toast: boolean; type: string; message: string };
                        if (flash.type === 'success') {
                            // If face matches, capture image and submit time in
                            if (webcamRef.current) {
                                const imageSrc = webcamRef.current.getScreenshot();
                                if (imageSrc) {
                                    // Convert base64 to blob
                                    fetch(imageSrc)
                                        .then((res) => res.blob())
                                        .then((blob) => {
                                            const formData = new FormData();
                                            formData.append('image', blob, 'time-in.jpg');

                                            router.post(route('student.time-records.time-in.store'), formData, {
                                                onSuccess: () => {
                                                    router.visit(route('student.time-records.index'));
                                                },
                                                onError: (errors) => {
                                                    toast.error(errors.message || 'Failed to record time in');
                                                    setIsProcessing(false);
                                                },
                                            });
                                        });
                                }
                            }
                        } else {
                            console.log('error');
                            toast.error(flash.message);
                            setIsProcessing(false);
                        }
                    },
                    onError: (errors) => {
                        toast.error(errors.message || 'Face verification failed');
                        setIsProcessing(false);
                    },
                });
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Face verification failed');
                setIsProcessing(false);
            }
        }
    }, [isWebcamReady]);

    useEffect(() => {
        loadModels();
        const interval = setInterval(detectFace, 1000);
        return () => clearInterval(interval);
    }, [loadModels, detectFace]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time In" />
            <div className="from-background to-muted/20 @container/main flex flex-1 flex-col gap-6 bg-gradient-to-br p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Time In Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center gap-4">
                        <div className="relative">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                width={940}
                                height={650}
                                screenshotFormat="image/jpeg"
                                className="rounded-lg"
                                onUserMedia={() => setIsWebcamReady(true)}
                                onUserMediaError={() => {
                                    toast.error('Failed to access camera. Please check your camera permissions.');
                                    setIsWebcamReady(false);
                                }}
                            />
                            <canvas ref={canvasRef} width={940} height={650} className="absolute top-0 left-0" />
                        </div>
                        <div className="flex justify-center">
                            <Button onClick={() => router.visit(route('student.time-records.index'))} variant="outline" disabled={isProcessing}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
