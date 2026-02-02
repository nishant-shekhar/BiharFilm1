import React from "react";
import { CheckCircle2, Clock, Send, XCircle, FileCheck, AlertCircle } from "lucide-react";

const NOCTimeline = ({ nocForm }) => {
  // Timeline steps based on status
  const getTimelineSteps = () => {
    const steps = [
      {
        id: 1,
        title: "Application Submitted",
        description: "Your NOC form has been submitted successfully",
        date: nocForm.createdAt,
        status: "completed",
        icon: FileCheck,
      },
      {
        id: 2,
        title: "Under Review",
        description: nocForm.adminActionBy
          ? `Reviewed by ${nocForm.adminActionBy}`
          : "Admin is reviewing your application",
        date: nocForm.status === "under_review" ? nocForm.adminActionAt : null,
        status: nocForm.status === "submitted" ? "pending" : "completed",
        icon: Clock,
        remarks: nocForm.adminRemarks
      },
      {
        id: 3,
        title: "Forwarded to District",
        description: nocForm.forwardedToDistricts?.length > 0
          ? `Forwarded to ${nocForm.forwardedToDistricts.map(d => d.districtName).join(", ")}`
          : "Forwarding to district administration",
        date: nocForm.forwardedAt,
        status: nocForm.status === "forwarded" || nocForm.status === "approved" || nocForm.status === "rejected"
          ? "completed"
          : nocForm.status === "under_review" ? "current" : "pending",
        icon: Send,
        showDepartments: true
      }
    ];

    // Final step - Approved or Rejected
    if (nocForm.status === "approved") {
      steps.push({
        id: 4,
        title: "Approved by District Admin",
        description: nocForm.districtActionBy
          ? `Approved by ${nocForm.districtActionBy}`
          : "Your application has been approved",
        date: nocForm.districtActionAt,
        status: "completed",
        icon: CheckCircle2,
        remarks: nocForm.districtRemarks
      });
    } else if (nocForm.status === "rejected") {
      steps.push({
        id: 4,
        title: "Application Rejected",
        description: nocForm.districtActionBy
          ? `Rejected by ${nocForm.districtActionBy}`
          : "Your application has been rejected",
        date: nocForm.districtActionAt || nocForm.rejectedAt,
        status: "rejected",
        icon: XCircle,
        remarks: nocForm.districtRemarks || nocForm.adminRemarks
      });
    } else if (nocForm.status === "forwarded") {
      steps.push({
        id: 4,
        title: "Awaiting District Decision",
        description: "District admin is reviewing your application",
        date: null,
        status: "current",
        icon: Clock,
      });
    }

    return steps;
  };

  const timelineSteps = getTimelineSteps();

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-black border-black",
          icon: "text-white"
        };
      case "current":
        return {
          circle: "bg-gray-900 border-gray-900",
          icon: "text-white"
        };
      case "rejected":
        return {
          circle: "bg-gray-400 border-gray-400",
          icon: "text-white"
        };
      case "pending":
        return {
          circle: "bg-white border-gray-300",
          icon: "text-gray-400"
        };
      default:
        return {
          circle: "bg-white border-gray-300",
          icon: "text-gray-400"
        };
    }
  };

  return (
    <div className="bg-white border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">Application Timeline</h3>
      </div>

      {/* Timeline */}
      <div className="px-6 py-5">
        <div className="relative">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === timelineSteps.length - 1;
            const styles = getStatusStyles(step.status);

            return (
              <div key={step.id} className="relative pb-6 last:pb-0">
                {/* Vertical Line */}
                {!isLast && (
                  <div
                    className={`absolute left-4 top-10 w-px h-[calc(100%-2.5rem)] ${step.status === "completed" ? "bg-black" : "bg-gray-300"
                      }`}
                  ></div>
                )}

                {/* Timeline Item */}
                <div className="flex gap-4">
                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${styles.circle}`}
                  >
                    <Icon size={14} className={styles.icon} strokeWidth={2.5} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-0.5 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {step.title}
                      </h4>

                      {/* Status Badge */}
                      {step.status === "current" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-900 text-white text-[10px] font-medium uppercase tracking-wide whitespace-nowrap">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    {step.date && (
                      <span className="text-[11px] text-gray-500 font-medium block mb-2">
                        {formatDate(step.date)}
                      </span>
                    )}

                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {step.description}
                    </p>

                    {/* Forwarded Districts */}
                    {step.showDepartments && nocForm.forwardedToDistricts?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                          Forwarded Districts
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {nocForm.forwardedToDistricts.map((district, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-[11px] font-medium border border-gray-200"
                            >
                              {district.districtName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Forwarded Departments */}
                    {step.showDepartments && nocForm.forwardedToDepartments?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                          Forwarded Departments
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {nocForm.forwardedToDepartments.map((dept, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-[11px] font-medium border border-gray-200"
                            >
                              {dept.departmentName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remarks */}
                    {step.remarks && (
                      <div className="bg-gray-50 border border-gray-200 p-3">
                        <div className="flex gap-2">
                          <AlertCircle size={14} className="text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold text-gray-900 uppercase tracking-wide mb-1">
                              Remarks
                            </p>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {step.remarks}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NOCTimeline;
