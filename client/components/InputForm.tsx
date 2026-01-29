"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type FormProps = {
  video: FileList | null;
};

export default function InputForm() {
  const router = useRouter();

  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { control, handleSubmit, reset } = useForm<FormProps>({
    defaultValues: {
      video: null,
    },
  });

  const onSubmit = async (data: FormProps) => {
    if (!data.video || data.video.length === 0) {
      alert("Please select a video first");
      return;
    }

    setIsProcessing(true);
    setResult(null);

    const formData = new FormData();
    formData.append("video", data.video[0]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8080/api/v1/public/upload-video",
        {
          method: "POST",
          body: formData,
        }
      );

      const resData = await response.json();
      setResult(resData);

      if (resData.status === "success") {
        const videoPath = `http://127.0.0.1:8080/api/v1/public/video/${resData.video}`;
        setVideoUrl(videoPath);
      }
    } catch (error) {
      alert("Video processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setLocalPreview(null);
    setVideoUrl(null);
    setResult(null);
    reset();
  };

  return (
    <main className="max-w-[900px] min-h-[400px] mx-auto space-y-6">
      {/* ---------------- PROCESSING STATE ---------------- */}
      {isProcessing && (
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded text-center">
          ⏳ <strong>Processing video...</strong> Please wait while we analyze
          the footage.
        </div>
      )}

      {/* ---------------- RESULT STATE ---------------- */}
      {result && !isProcessing && (
        <>
          {result.analysis?.result === "No Accident" && (
            <div className="p-4 bg-green-100 border border-green-300 rounded">
              ✅ <strong>No accident detected.</strong> Traffic conditions
              appear normal.
            </div>
          )}

          {result.analysis?.result === "Accident" && (
            <div className="p-4 bg-red-100 border border-red-300 rounded space-y-3">
              🚨 <strong>Accident detected!</strong>
              <p>
                Severity:{" "}
                <strong>
                  {result.analysis.severity} (
                  {result.analysis.severityInPercentage}%)
                </strong>
              </p>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() =>
                  router.push(`/dashboard/accident/${result.accidentId}`)
                }
              >
                View Accident Details
              </button>
            </div>
          )}

          <div className="p-4 bg-gray-100 rounded flex gap-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={resetUpload}
            >
              Upload Another Video
            </button>

            <button
              className="px-4 py-2 border rounded"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </button>
          </div>
        </>
      )}

      {/* ---------------- VIDEO PREVIEW ---------------- */}
      {videoUrl && (
        <div className="w-full min-h-[300px] border-4 rounded-md border-dashed p-2">
          <ReactPlayer
            url={videoUrl}
            controls
            width="100%"
            height="100%"
          />
        </div>
      )}

      {/* ---------------- UPLOAD FORM ---------------- */}
      {!videoUrl && !isProcessing && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="video"
            control={control}
            render={({ field }) => (
              <>
                <label
                  htmlFor="video"
                  className="uppercase min-h-[200px] md:min-h-[400px] py-10 border-4 rounded-lg border-dashed bg-slate-100 flex items-center justify-center cursor-pointer"
                >
                  Click to upload
                </label>

                <input
                  type="file"
                  accept="video/*"
                  id="video"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      field.onChange(e.target.files);
                      setLocalPreview(
                        URL.createObjectURL(e.target.files[0])
                      );
                    }
                  }}
                />
              </>
            )}
          />

          {localPreview && (
            <div className="mt-4">
              <ReactPlayer
                url={localPreview}
                controls
                width="100%"
                height="300px"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="font-bold py-4 px-8 bg-gray-900 rounded-md text-white w-full mt-4 disabled:opacity-50"
          >
            Submit this Video
          </button>
        </form>
      )}
    </main>
  );
}
