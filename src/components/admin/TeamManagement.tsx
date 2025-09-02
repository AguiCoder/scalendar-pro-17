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

// Mock data
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

const DoctorManagement = () => {
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
      toast({ title: "Doctor updated successfully" });
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
      toast({ title: "Doctor added successfully" });
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
    toast({ title: "Doctor status updated" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Doctors
            </CardTitle>
            <CardDescription>Manage medical staff and their specialties</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingDoctor(null); form.reset(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
                <DialogDescription>
                  {editingDoctor ? "Update doctor information" : "Add a new doctor to the system"}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
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
                        <FormLabel>CRM Number</FormLabel>
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
                        <FormLabel>Primary Specialty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialty" />
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
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
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
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Doctor can be assigned to shifts
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
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingDoctor ? "Update" : "Add"} Doctor
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
                <TableHead>Name</TableHead>
                <TableHead>CRM</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
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
                      {doctor.active ? "Active" : "Inactive"}
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
                        {doctor.active ? "Deactivate" : "Activate"}
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
      toast({ title: "Department updated successfully" });
    } else {
      const newDepartment = { id: String(departments.length + 1), name: data.name, description: data.description };
      setDepartments(prev => [...prev, newDepartment]);
      toast({ title: "Department added successfully" });
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
    toast({ title: "Department deleted successfully" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Departments
            </CardTitle>
            <CardDescription>Manage hospital departments and units</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingDepartment(null); form.reset(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDepartment ? "Edit Department" : "Add New Department"}</DialogTitle>
                <DialogDescription>
                  {editingDepartment ? "Update department information" : "Add a new department to the system"}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the department's services"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingDepartment ? "Update" : "Add"} Department
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
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
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
      toast({ title: "Specialty updated successfully" });
    } else {
      const newSpecialty = { id: String(specialties.length + 1), code: data.code, name: data.name };
      setSpecialties(prev => [...prev, newSpecialty]);
      toast({ title: "Specialty added successfully" });
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
    toast({ title: "Specialty deleted successfully" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Specialties
            </CardTitle>
            <CardDescription>Manage medical specialties and certifications</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingSpecialty(null); form.reset(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Specialty
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSpecialty ? "Edit Specialty" : "Add New Specialty"}</DialogTitle>
                <DialogDescription>
                  {editingSpecialty ? "Update specialty information" : "Add a new medical specialty"}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialty Code</FormLabel>
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
                        <FormLabel>Specialty Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Cardiology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingSpecialty ? "Update" : "Add"} Specialty
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
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
        <CardDescription>Manage doctors, departments, and specialties</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="doctors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
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