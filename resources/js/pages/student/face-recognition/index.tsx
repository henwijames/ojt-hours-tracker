import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import * as faceapi from 'face-api.js';
import { useCallback, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Face Recognition',
        href: '/student/face-recognition',
    },
];

export default function FaceRecognition() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const loadModels = useCallback(() => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]).then(() => detectMyFace());
    }, []);

    const detectMyFace = useCallback(() => {
        setInterval(async () => {
            if (!webcamRef.current || !webcamRef.current.video) return;

            const detections = await faceapi
                .detectAllFaces(webcamRef.current.video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

            if (canvasRef.current) {
                const displaySize = { width: 940, height: 650 };
                faceapi.matchDimensions(canvasRef.current, displaySize);
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            }
        }, 100);
    }, []);

    const handleGetFaceData = async () => {
        if (!webcamRef.current || !webcamRef.current.video) return;

        const detections = await faceapi
            .detectAllFaces(webcamRef.current.video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length > 0) {
            const faceData = {
                descriptor: Array.from(detections[0].descriptor),
                position: {
                    x: detections[0].detection.box.x,
                    y: detections[0].detection.box.y,
                    width: detections[0].detection.box.width,
                    height: detections[0].detection.box.height,
                },
            };

            // Save to database
            router.post(route('student.face-recognition.store'), faceData, {
                onSuccess: () => {
                    toast.success('Face data saved successfully');
                },
                onError: () => {
                    toast.error('Failed to save face data');
                },
            });
        } else {
            toast.error('No face detected');
            console.log('No face detected');
        }
    };

    const handleCompareFace = async () => {
        if (!webcamRef.current || !webcamRef.current.video) return;

        const detections = await faceapi
            .detectAllFaces(webcamRef.current.video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length > 0) {
            const faceData = {
                descriptor: Array.from(detections[0].descriptor),
            };

            // Compare with stored face
            router.post(route('student.face-recognition.compare'), faceData, {
                preserveScroll: true,
                onSuccess: (response: any) => {
                    console.log(response);
                },
                onError: () => {
                    toast.error('Failed to compare face');
                },
            });
        } else {
            toast.error('No face detected');
        }
    };

    useEffect(() => {
        loadModels();
    }, [loadModels]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Face Recognition" />
            <div className="from-background to-muted/20 @container/main flex flex-1 flex-col gap-6 bg-gradient-to-br p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Face Recognition</CardTitle>
                        <CardDescription>Register your face to the system</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center gap-4">
                        <div className="relative">
                            <Webcam ref={webcamRef} audio={false} width={940} height={650} className="rounded-lg" />
                            <canvas ref={canvasRef} width={940} height={650} className="absolute top-0 left-0" />
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={handleGetFaceData} className="w-fit">
                                Register Face
                            </Button>
                            <Button onClick={handleCompareFace} className="w-fit">
                                Compare Face
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
