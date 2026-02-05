import React from "react";
import {
  CheckCircle2,
  Clock,
  Send,
  XCircle,
  FileCheck,
  AlertCircle,
} from "lucide-react";

const NOCTimeline = ({ nocForm }) => {
  if (!nocForm) return null;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
      case "APPROVED":
        return {
          circle: "bg-green-600 border-green-600",
          icon: "text-white",
          text: "text-green-700",
        };
      case "REJECTED":
      case "DECLINED":
        return {
          circle: "bg-red-600 border-red-600",
          icon: "text-white",
          text: "text-red-700",
        };
      case "FORWARDED":
        return {
          circle: "bg-blue-600 border-blue-600",
          icon: "text-white",
          text: "text-blue-700",
        };
      case "SUBMITTED":
        return {
          circle: "bg-purple-600 border-purple-600",
          icon: "text-white",
          text: "text-purple-700",
        };
      default:
        return {
          circle: "bg-gray-200 border-gray-300",
          icon: "text-gray-400",
          text: "text-gray-500",
        };
    }
  };

  // Generate timeline nodes
  const generateNodes = () => {
    const nodes = [];

    // 1. Submission Node
    nodes.push({
      id: "submission",
      title: "Application Submitted",
      description: "Initial application received and recorded in system.",
      date: nocForm.createdAt,
      status: "SUBMITTED",
      icon: FileCheck,
    });

    // 2. Permission Requests Nodes
    if (nocForm.permissionRequests && nocForm.permissionRequests.length > 0) {
      // Sort by date to show sequence
      const sortedRequests = [...nocForm.permissionRequests].sort((a, b) => {
        const dateA = a.decidedAt || a.forwardedAt;
        const dateB = b.decidedAt || b.forwardedAt;
        return new Date(dateA) - new Date(dateB);
      });

      sortedRequests.forEach((req) => {
        // If not decided yet, it's a "Forwarded" step
        if (req.status === "FORWARDED") {
          nodes.push({
            id: `forward-${req.id}`,
            title: `Forwarded to ${req.officeName}`,
            description: `Sent for departmental clearance to ${req.officeType.toLowerCase()} office.`,
            date: req.forwardedAt,
            status: "FORWARDED",
            icon: Send,
          });
        } else {
          // It's a decision node
          nodes.push({
            id: `decision-${req.id}`,
            title: `${req.status === "ACCEPTED" ? "Approved" : "Rejected"} by ${req.officeName}`,
            description:
              req.remarks ||
              `Decision rendered by ${req.officeName} administration.`,
            date: req.decidedAt,
            status: req.status,
            icon: req.status === "ACCEPTED" ? CheckCircle2 : XCircle,
            remarks: req.remarks,
          });
        }
      });
    }

    // 3. Final Approval Node
    if (
      nocForm.finalApproval?.completed &&
      nocForm.finalApproval?.isApproved &&
      nocForm.finalApproval?.status === "APPROVED"
    ) {
      nodes.push({
        id: "final-approval",
        title: "Final Approval Grant",
        description: "Competent Authority has granted final approval.",
        date: nocForm.finalApproval.approvedAt || new Date().toISOString(), // Fallback if no date provided
        status: "APPROVED",
        icon: CheckCircle2,
      });
    }

    return nodes;
  };

  const nodes = generateNodes();

  return (
    <div className="p-6">
      <div className="relative">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const styles = getStatusStyles(node.status);
          const isLast = index === nodes.length - 1;

          return (
            <div key={node.id} className="relative pb-8 last:pb-0">
              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-[15px] top-[30px] w-[2px] h-[calc(100%-20px)] bg-gray-100"></div>
              )}

              {/* Node Content */}
              <div className="flex gap-4">
                {/* Icon Circle */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0 ${styles.circle} shadow-sm`}
                >
                  <Icon size={14} className={styles.icon} strokeWidth={3} />
                </div>

                {/* Text Content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-tight">
                      {node.title}
                    </h4>
                    {node.date && (
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest whitespace-nowrap">
                        {new Date(node.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-2">
                    {node.description}
                  </p>

                  {node.date && (
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(node.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}

                  {node.remarks && (
                    <div className="mt-2 p-2 bg-gray-50 border-l-2 border-gray-200 rounded text-[10px] italic text-gray-600">
                      "{node.remarks}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NOCTimeline;
