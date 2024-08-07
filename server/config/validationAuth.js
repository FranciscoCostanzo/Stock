import { z } from "zod";

// Función de validación para espacios
const noSpaces = (val) => !/\s/.test(val);

// Esquema común para nombre
const nombreSchema = z
  .string()
  .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
  .max(50, { message: "El nombre no debe exceder los 50 caracteres." })
  .refine(noSpaces, { message: "El nombre no debe contener espacios." });

// Esquema común para password
const passwordSchema = z
  .string()
  .min(6, { message: "La contraseña debe tener al menos 6 caracteres." })
  .refine(noSpaces, { message: "La contraseña no debe contener espacios." });

// Esquema para rol
const rolSchema = z.enum(["admin", "empleado"], {
  message: "El rol debe ser 'admin' o 'empleado'.",
});

// Esquema de validación para registro
export const registerSchema = z.object({
  nombre: nombreSchema,
  password: passwordSchema,
  rol: rolSchema,
  sucursal: z.number().optional()
});

// Esquema de validación para login
export const loginSchema = z.object({
  nombre: nombreSchema,
  password: passwordSchema,
});