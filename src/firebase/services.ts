import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import type {
  UseCase,
  Role,
  ProcessStep,
  DataAsset,
  Application,
  BusinessRule,
  SLA,
  Metrics,
} from '../types';

// Use Case Operations
export const useCaseService = {
  async create(data: Partial<UseCase>) {
    const docRef = await addDoc(collection(db, 'useCases'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<UseCase>) {
    const docRef = doc(db, 'useCases', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string) {
    await deleteDoc(doc(db, 'useCases', id));
  },

  async get(id: string) {
    const docRef = doc(db, 'useCases', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UseCase;
    }
    return null;
  },

  async list(userId: string) {
    const q = query(
      collection(db, 'useCases'),
      where('ownerId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as UseCase));
  },
};

// Subcollection operations factory
function createSubcollectionService<T>(subcollectionName: string) {
  return {
    async create(useCaseId: string, data: Partial<T>) {
      const docRef = await addDoc(
        collection(db, 'useCases', useCaseId, subcollectionName),
        {
          ...data,
          useCaseId,
          createdAt: Timestamp.now(),
        }
      );
      return docRef.id;
    },

    async update(useCaseId: string, id: string, data: Partial<T>) {
      const docRef = doc(db, 'useCases', useCaseId, subcollectionName, id);
      await updateDoc(docRef, data);
    },

    async delete(useCaseId: string, id: string) {
      await deleteDoc(doc(db, 'useCases', useCaseId, subcollectionName, id));
    },

    async list(useCaseId: string) {
      const snapshot = await getDocs(
        collection(db, 'useCases', useCaseId, subcollectionName)
      );
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
    },
  };
}

// Export subcollection services
export const roleService = createSubcollectionService<Role>('roles');
export const stepService = createSubcollectionService<ProcessStep>('processSteps');
export const assetService = createSubcollectionService<DataAsset>('dataAssets');
export const appService = createSubcollectionService<Application>('applications');
export const ruleService = createSubcollectionService<BusinessRule>('rules');
export const slaService = createSubcollectionService<SLA>('slas');

// Metrics operations (singleton per use case)
export const metricsService = {
  async save(useCaseId: string, data: Partial<Metrics>) {
    const docRef = doc(db, 'useCases', useCaseId, 'metrics', 'current');
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  async get(useCaseId: string) {
    const docRef = doc(db, 'useCases', useCaseId, 'metrics', 'current');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Metrics;
    }
    return null;
  },
};

// Batch operations
export async function exportUseCasePack(useCaseId: string) {
  const useCase = await useCaseService.get(useCaseId);
  const roles = await roleService.list(useCaseId);
  const steps = await stepService.list(useCaseId);
  const assets = await assetService.list(useCaseId);
  const apps = await appService.list(useCaseId);
  const rules = await ruleService.list(useCaseId);
  const slas = await slaService.list(useCaseId);
  const metrics = await metricsService.get(useCaseId);

  return {
    useCase,
    process: { roles, steps },
    dataAssets: assets,
    applications: apps,
    rules,
    slas,
    metrics,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
}
