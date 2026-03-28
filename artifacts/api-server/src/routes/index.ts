import { Router, type IRouter } from "express";
import healthRouter from "./health";
import filesRouter from "./files";

const router: IRouter = Router();

router.use(healthRouter);
router.use(filesRouter);

export default router;
