import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkOrder {
  id: string;
  date: string;
  department: string;
  specialty: string;
  shiftType: string;
  priority: string;
  status: "valid" | "error";
  errors?: string[];
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO-001",
    date: "2024-01-15",
    department: "Emergency Medicine",
    specialty: "Emergency Medicine",
    shiftType: "Day Shift",
    priority: "High",
    status: "valid"
  },
  {
    id: "WO-002",
    date: "2024-01-16",
    department: "Cardiology",
    specialty: "Cardiology",
    shiftType: "Night Shift",
    priority: "Medium",
    status: "error",
    errors: ["Invalid specialty code", "Missing required field: location"]
  },
  {
    id: "WO-003",
    date: "2024-01-17",
    department: "Neurology",
    specialty: "Neurology",
    shiftType: "Day Shift",
    priority: "Low",
    status: "valid"
  }
];

export const WorkOrdersImport = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImported, setIsImported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setWorkOrders(mockWorkOrders);
          setIsImported(true);
          toast({
            title: "File uploaded successfully",
            description: `Processed ${mockWorkOrders.length} work orders`
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleImportWorkOrders = async () => {
    const validOrders = workOrders.filter(wo => wo.status === "valid");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Work orders imported",
      description: `Successfully imported ${validOrders.length} work orders`
    });
  };

  const downloadTemplate = () => {
    const csvContent = `id,date,department,specialty,shiftType,priority,location
WO-001,2024-01-15,Emergency Medicine,Emergency Medicine,Day Shift,High,Floor 1
WO-002,2024-01-16,Cardiology,Cardiology,Night Shift,Medium,Floor 2`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'work_orders_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const validCount = workOrders.filter(wo => wo.status === "valid").length;
  const errorCount = workOrders.filter(wo => wo.status === "error").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Work Orders Import
          </CardTitle>
          <CardDescription>
            Import service orders via CSV file to generate schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              
              <div>
                <h3 className="font-semibold">Upload CSV File</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your work orders CSV file or click to browse
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Template
                </Button>
              </div>
              
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Import Summary */}
          {isImported && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-status-confirmed" />
                    <span className="text-sm font-medium">Valid Orders</span>
                  </div>
                  <p className="text-2xl font-bold text-status-confirmed">{validCount}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Errors</span>
                  </div>
                  <p className="text-2xl font-bold text-destructive">{errorCount}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Total</span>
                  </div>
                  <p className="text-2xl font-bold">{workOrders.length}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Table */}
      {workOrders.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Preview & Validation</CardTitle>
                <CardDescription>
                  Review imported work orders before processing
                </CardDescription>
              </div>
              <Button 
                onClick={handleImportWorkOrders}
                disabled={validCount === 0}
              >
                Import {validCount} Valid Orders
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {errorCount > 0 && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorCount} work orders have validation errors. Please fix these issues before importing.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Shift Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map((order) => (
                    <TableRow key={order.id} className={order.status === "error" ? "bg-destructive/10" : ""}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.department}</TableCell>
                      <TableCell>{order.specialty}</TableCell>
                      <TableCell>{order.shiftType}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.priority === "High" ? "destructive" :
                            order.priority === "Medium" ? "default" : "secondary"
                          }
                        >
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge 
                            variant={order.status === "valid" ? "secondary" : "destructive"}
                            className={
                              order.status === "valid" 
                                ? "bg-status-confirmed text-status-confirmed-foreground"
                                : ""
                            }
                          >
                            {order.status === "valid" ? "Valid" : "Error"}
                          </Badge>
                          {order.errors && (
                            <div className="space-y-1">
                              {order.errors.map((error, idx) => (
                                <p key={idx} className="text-xs text-destructive">
                                  {error}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};