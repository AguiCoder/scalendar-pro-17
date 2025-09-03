import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, UserPlus, Building, Award } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// Form schemas
const doctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  crm: z.string().min(1, "CRM is required"),
  specialties: z.string(),
  department: z.string().min(1, "Department is required"),
  active: z.boolean().default(true),
});

const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
});

const specialtySchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type DoctorFormData = z.infer<typeof doctorSchema>;
type DepartmentFormData = z.infer<typeof departmentSchema>;
type SpecialtyFormData = z.infer<typeof specialtySchema>;

// Mock data with translations - moved to top level for all components to access
const mockDoctors = [
  { id: "1", name: "Dr. Sarah Johnson", crm: "CRM-12345", specialties: ["Cardiology"], department: "Emergency Medicine", active: true },
  { id: "2", name: "Dr. Michael Chen", crm: "CRM-23456", specialties: ["Neurology"], department: "Neurology", active: true },
  { id: "3", name: "Dr. Emily Rodriguez", crm: "CRM-34567", specialties: ["Pediatrics"], department: "Pediatrics", active: false },
];

const mockDepartments = [
  { id: "1", name: "Emergency Medicine", description: "24/7 emergency care services" },
  { id: "2", name: "Cardiology", description: "Heart and cardiovascular system treatment" },
  { id: "3", name: "Neurology", description: "Nervous system disorders treatment" },
];

const mockSpecialties = [
  { id: "1", code: "CARD", name: "Cardiology" },
  { id: "2", code: "NEUR", name: "Neurology" },
  { id: "3", code: "PEDI", name: "Pediatrics" },
];

const DoctorManagement = () => {
  const { t } = useTranslation();
  
  const [doctors, setDoctors] = useState(mockDoctors);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<typeof mockDoctors[0] | null>(null);
  const { toast } = useToast();

  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      crm: "",
      specialties: "",
      department: "",
      active: true,
    },
  });

  const onSubmit = async (data: DoctorFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingDoctor) {
      setDoctors(prev => prev.map(doc => 
        doc.id === editingDoctor.id 
          ? { ...doc, name: data.name, crm: data.crm, specialties: [data.specialties], department: data.department, active: data.active }
          : doc
      ));
      toast({ title: t("admin.team.doctors.toasts.updated") });
    } else {
      const newDoctor = {
        id: String(doctors.length + 1),
        name: data.name,
        crm: data.crm,
        specialties: [data.specialties],
        department: data.department,
        active: data.active
      };
      setDoctors(prev => [...prev, newDoctor]);
      toast({ title: t("admin.team.doctors.toasts.added") });
    }
    
    setDialogOpen(false);
    setEditingDoctor(null);
    form.reset();
  };

  const handleEdit = (doctor: typeof mockDoctors[0]) => {
    setEditingDoctor(doctor);
    form.reset({
      name: doctor.name,
      crm: doctor.crm,
      specialties: doctor.specialties[0],
      department: doctor.department,
      active: doctor.active,
    });
    setDialogOpen(true);
  };

  const handleToggleActive = (doctorId: string) => {
    setDoctors(prev => prev.map(doc => 
      doc.id === doctorId ? { ...doc, active: !doc.active } : doc
    ));
    toast({ title: t("admin.team.doctors.toasts.statusUpdated") });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {t('admin.team.doctors.title')}
            </CardTitle>
            <CardDescription>{t('admin.team.doctors.subtitle')}</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingDoctor(null); form.reset(); }}>
                <Plus className="h-4 w-4 mr-2" />
                {t('admin.team.doctors.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDoctor ? t('admin.team.doctors.edit') : t('admin.team.doctors.addNew')}</DialogTitle>
                <DialogDescription>
                  {editingDoctor ? t('admin.team.doctors.updateInfo') : t('admin.team.doctors.addInfo')}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.team.doctors.form.fullName')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="crm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.team.doctors.form.crm')}</FormLabel>
                        <FormControl>
                          <Input placeholder="CRM-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialties"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.team.doctors.form.primarySpecialty')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('admin.team.doctors.form.selectSpecialty')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockSpecialties.map((specialty) => (
                              <SelectItem key={specialty.id} value={specialty.name}>
                                {specialty.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.team.doctors.form.department')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('admin.team.doctors.form.selectDepartment')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockDepartments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.name}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t('admin.team.doctors.form.activeStatus')}</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            {t('admin.team.doctors.form.activeHint')}
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      {t('admin.team.doctors.actions.cancel')}
                    </Button>
                    <Button type="submit">
                      {editingDoctor ? t('admin.team.doctors.actions.update') : t('admin.team.doctors.actions.add')}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.team.doctors.table.name')}</TableHead>
                <TableHead>{t('admin.team.doctors.table.crm')}</TableHead>
                <TableHead>{t('admin.team.doctors.table.specialties')}</TableHead>
                <TableHead>{t('admin.team.doctors.table.department')}</TableHead>
                <TableHead>{t('admin.team.doctors.table.status')}</TableHead>
                <TableHead>{t('admin.team.doctors.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.crm}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {doctor.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{doctor.department}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={doctor.active ? "secondary" : "outline"}
                      className={doctor.active ? "bg-status-confirmed text-status-confirmed-foreground" : ""}
                    >
                      {doctor.active ? t('admin.team.doctors.table.active') : t('admin.team.doctors.table.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(doctor)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleActive(doctor.id)}
                      >
                        {doctor.active ? t('admin.team.doctors.actions.deactivate') : t('admin.team.doctors.actions.activate')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState(mockDepartments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<typeof mockDepartments[0] | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = async (data: DepartmentFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingDepartment) {
      setDepartments(prev => prev.map(dept => 
        dept.id === editingDepartment.id ? { ...dept, name: data.name, description: data.description } : dept
      ));
      toast({ title: t('admin.team.departments.toasts.updated') });
    } else {
      const newDepartment = { id: String(departments.length + 1), name: data.name, description: data.description };
      setDepartments(prev => [...prev, newDepartment]);
      toast({ title: t('admin.team.departments.toasts.added') });
    }
    
    setDialogOpen(false);
    setEditingDepartment(null);
    form.reset();
  };

  const handleEdit = (department: typeof mockDepartments[0]) => {
    setEditingDepartment(department);
    form.reset(department);
    setDialogOpen(true);
  };

  const handleDelete = (departmentId: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
    toast({ title: t('admin.team.departments.toasts.deleted') });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {t('admin.team.departments.title')}
            </CardTitle>
            <CardDescription>{t('admin.team.departments.subtitle')}</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingDepartment(null); form.reset(); }}>
                <Plus className="h-4 w-4 mr-2" />
                {t('admin.team.departments.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDepartment ? t('admin.team.departments.edit') : t('admin.team.departments.addNew')}</DialogTitle>
                <DialogDescription>
                  {editingDepartment ? t('admin.team.departments.updateInfo') : t('admin.team.departments.addInfo')}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.team.departments.form.name')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Emergency Medicine" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.team.departments.form.description')}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t('admin.team.departments.form.descriptionPlaceholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      {t('admin.team.departments.actions.cancel')}
                    </Button>
                    <Button type="submit">
                      {editingDepartment ? t('admin.team.departments.actions.update') : t('admin.team.departments.actions.add')}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.team.departments.table.name')}</TableHead>
                <TableHead>{t('admin.team.departments.table.description')}</TableHead>
                <TableHead>{t('admin.team.departments.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(department)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(department.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const SpecialtyManagement = () => {
  const [specialties, setSpecialties] = useState(mockSpecialties);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<typeof mockSpecialties[0] | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<SpecialtyFormData>({
    resolver: zodResolver(specialtySchema),
    defaultValues: { code: "", name: "" },
  });

  const onSubmit = async (data: SpecialtyFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingSpecialty) {
      setSpecialties(prev => prev.map(spec => 
        spec.id === editingSpecialty.id ? { ...spec, code: data.code, name: data.name } : spec
      ));
      toast({ title: t('admin.team.specialties.toasts.updated') });
    } else {
      const newSpecialty = { id: String(specialties.length + 1), code: data.code, name: data.name };
      setSpecialties(prev => [...prev, newSpecialty]);
      toast({ title: t('admin.team.specialties.toasts.added') });
    }
    
    setDialogOpen(false);
    setEditingSpecialty(null);
    form.reset();
  };

  const handleEdit = (specialty: typeof mockSpecialties[0]) => {
    setEditingSpecialty(specialty);
    form.reset(specialty);
    setDialogOpen(true);
  };

  const handleDelete = (specialtyId: string) => {
    setSpecialties(prev => prev.filter(spec => spec.id !== specialtyId));
    toast({ title: t('admin.team.specialties.toasts.deleted') });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {t('admin.team.specialties.title')}
            </CardTitle>
            <CardDescription>{t('admin.team.specialties.subtitle')}</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingSpecialty(null); form.reset(); }}>
                <Plus className="h-4 w-4 mr-2" />
                {t('admin.team.specialties.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSpecialty ? t('admin.team.specialties.edit') : t('admin.team.specialties.addNew')}</DialogTitle>
                <DialogDescription>
                  {editingSpecialty ? t('admin.team.specialties.updateInfo') : t('admin.team.specialties.addInfo')}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.team.specialties.form.code')}</FormLabel>
                        <FormControl>
                          <Input placeholder="CARD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.team.specialties.form.name')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Cardiology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      {t('admin.team.specialties.actions.cancel')}
                    </Button>
                    <Button type="submit">
                      {editingSpecialty ? t('admin.team.specialties.actions.update') : t('admin.team.specialties.actions.add')}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.team.specialties.table.code')}</TableHead>
                <TableHead>{t('admin.team.specialties.table.name')}</TableHead>
                <TableHead>{t('admin.team.specialties.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialties.map((specialty) => (
                <TableRow key={specialty.id}>
                  <TableCell className="font-medium">{specialty.code}</TableCell>
                  <TableCell>{specialty.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(specialty)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(specialty.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export const TeamManagement = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.team.title')}</CardTitle>
        <CardDescription>{t('admin.team.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="doctors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="doctors">{t('admin.team.tabs.doctors')}</TabsTrigger>
            <TabsTrigger value="departments">{t('admin.team.tabs.departments')}</TabsTrigger>
            <TabsTrigger value="specialties">{t('admin.team.tabs.specialties')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="doctors" className="space-y-4">
            <DoctorManagement />
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-4">
            <DepartmentManagement />
          </TabsContent>
          
          <TabsContent value="specialties" className="space-y-4">
            <SpecialtyManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};