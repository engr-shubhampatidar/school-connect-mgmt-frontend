"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchSchoolSettings,
  updateSchoolLocation,
  type SchoolLocation,
} from "../api/schoolSettings";

type SchoolLocationFormProps = {
  initialLocation?: SchoolLocation | null;
  onSaved?: (location: SchoolLocation) => void;
};

export function SchoolLocationForm({
  initialLocation,
  onSaved,
}: SchoolLocationFormProps) {
  const { toast } = useToast();
  const [latitude, setLatitude] = useState(
    initialLocation?.latitude != null ? String(initialLocation.latitude) : "",
  );
  const [longitude, setLongitude] = useState(
    initialLocation?.longitude != null
      ? String(initialLocation.longitude)
      : "",
  );
  const [locationName, setLocationName] = useState(
    initialLocation?.locationName ?? "",
  );
  const [geofenceRadius, setGeofenceRadius] = useState(
    String(initialLocation?.attendanceGeofenceRadiusMeters ?? 200),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialLocation) return;
    setLatitude(
      initialLocation.latitude != null ? String(initialLocation.latitude) : "",
    );
    setLongitude(
      initialLocation.longitude != null
        ? String(initialLocation.longitude)
        : "",
    );
    setLocationName(initialLocation.locationName ?? "");
    setGeofenceRadius(
      String(initialLocation.attendanceGeofenceRadiusMeters ?? 200),
    );
  }, [initialLocation]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setError(null);
      },
      () => {
        setError("Unable to detect your current location.");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const lat = Number(latitude);
    const lng = Number(longitude);
    const radius = Number(geofenceRadius);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      setError("Enter a valid latitude between -90 and 90.");
      return;
    }

    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      setError("Enter a valid longitude between -180 and 180.");
      return;
    }

    if (!Number.isFinite(radius) || radius < 50 || radius > 5000) {
      setError("Geofence radius must be between 50 and 5000 meters.");
      return;
    }

    setSaving(true);
    try {
      const saved = await updateSchoolLocation({
        latitude: lat,
        longitude: lng,
        locationName: locationName.trim() || undefined,
        attendanceGeofenceRadiusMeters: radius,
      });
      toast({
        title: "School location saved",
        description: "Teachers can now use this location for attendance.",
        type: "success",
      });
      onSaved?.(saved);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save school location";
      setError(message);
      toast({
        title: "Unable to save location",
        description: message,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[#1B263B]">
            School Location
          </h2>
          <p className="text-sm text-[#415A77] mt-1">
            Set the school coordinates used as the reference point for teacher
            attendance check-in and check-out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[#1B263B]">Latitude</span>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="22.719568"
              className="rounded-md border border-[#D7E3FC] px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[#1B263B]">Longitude</span>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="75.857727"
              className="rounded-md border border-[#D7E3FC] px-3 py-2"
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[#1B263B]">
            Location name (optional)
          </span>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Main campus, front gate"
            className="rounded-md border border-[#D7E3FC] px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[#1B263B]">
            Attendance geofence radius (meters)
          </span>
          <input
            type="number"
            min={50}
            max={5000}
            value={geofenceRadius}
            onChange={(e) => setGeofenceRadius(e.target.value)}
            className="rounded-md border border-[#D7E3FC] px-3 py-2"
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={handleUseCurrentLocation}>
            Use current location
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save location"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default SchoolLocationForm;
