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
import { useTranslation } from "react-i18next";

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



export const WorkOrdersImport = () => {
  const { t } = useTranslation();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImported, setIsImported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Mock data with translations
  const mockWorkOrders: WorkOrder[] = [
    {
      id: "WO-001",
      date: "2024-01-15",
      department: t('mocks.departments.emergencyMedicine'),
      specialty: t('mocks.departments.emergencyMedicine'),
      shiftType: t('mocks.shiftTypes.dayShift'),
      priority: "High",
      status: "valid"
    },
    {
      id: "WO-002",
      date: "2024-01-16",
      department: t('mocks.departments.cardiology'),
      specialty: t('mocks.departments.cardiology'),
      shiftType: t('mocks.shiftTypes.nightShift'),
      priority: "Medium",
      status: "error",
      errors: ["Invalid specialty code", "Missing required field: location"]
    },
    {
      id: "WO-003",
      date: "2024-01-17",
      department: t('mocks.departments.neurology'),
      specialty: t('mocks.departments.neurology'),
      shiftType: t('mocks.shiftTypes.dayShift'),
      priority: "Low",
      status: "valid"
    }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: t('admin.workOrders.upload.invalidTypeTitle'),
        description: t('admin.workOrders.upload.invalidTypeDesc'),
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
            title: t('admin.workOrders.upload.uploadedTitle'),
            description: t('admin.workOrders.upload.uploadedDesc', { count: mockWorkOrders.length })
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
      title: t('admin.workOrders.toasts.importedTitle'),
      description: t('admin.workOrders.toasts.importedDesc', { count: validOrders.length })
    });
  };

  const downloadTemplate = () => {
    const csvContent = `id,date,department,specialty,shiftType,priority,location
WO-001,2024-01-15,${t('mocks.departments.emergencyMedicine')},${t('mocks.departments.emergencyMedicine')},${t('mocks.shiftTypes.dayShift')},High,${t('mocks.locations.floor1')}
WO-002,2024-01-16,${t('mocks.departments.cardiology')},${t('mocks.departments.cardiology')},${t('mocks.shiftTypes.nightShift')},Medium,${t('mocks.locations.floor2')}`;
    
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
            {t('admin.workOrders.title')}
          </CardTitle>
          <CardDescription>
            {t('admin.workOrders.subtitle')}
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
                <h3 className="font-semibold">{t('admin.workOrders.upload.uploadCsv')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('admin.workOrders.upload.hint')}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('admin.workOrders.upload.chooseFile')}
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('admin.workOrders.upload.template')}
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
                <span>{t('admin.workOrders.upload.processing')}</span>
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
                    <span className="text-sm font-medium">{t('admin.workOrders.summary.valid')}</span>
                  </div>
                  <p className="text-2xl font-bold text-status-confirmed">{validCount}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">{t('admin.workOrders.summary.errors')}</span>
                  </div>
                  <p className="text-2xl font-bold text-destructive">{errorCount}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('admin.workOrders.summary.total')}</span>
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
                <CardTitle>{t('admin.workOrders.preview.title')}</CardTitle>
                <CardDescription>
                  {t('admin.workOrders.preview.subtitle')}
                </CardDescription>
              </div>
              <Button 
                onClick={handleImportWorkOrders}
                disabled={validCount === 0}
              >
                {t('admin.workOrders.preview.import', { count: validCount })}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {errorCount > 0 && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t('admin.workOrders.preview.errorAlert', { count: errorCount })}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.workOrders.preview.table.id')}</TableHead>
                    <TableHead>{t('admin.workOrders.preview.table.date')}</TableHead>
                    <TableHead>{t('admin.workOrders.preview.table.department')}</TableHead>
                    <TableHead>{t('admin.workOrders.preview.table.specialty')}</TableHead>
                    <TableHead>{t('admin.workOrders.preview.table.shiftType')}</TableHead>
                    <TableHead>{t('admin.workOrders.preview.table.priority')}</TableHead>
                    <TableHead>{t('admin.workOrders.preview.table.status')}</TableHead>
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
                            {order.status === "valid" ? t('admin.workOrders.preview.table.valid') : t('admin.workOrders.preview.table.error')}
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