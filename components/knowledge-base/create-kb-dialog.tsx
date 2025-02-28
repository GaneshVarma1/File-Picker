"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createKnowledgeBase, syncKnowledgeBase } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CreateKBDialogProps {
  selectedFiles: string[];
  onSuccess: () => void;
}

export function CreateKBDialog({ selectedFiles, onSuccess }: CreateKBDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one file to index',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create knowledge base
      const kb = await createKnowledgeBase(
        selectedFiles,
        name,
        description
      );
      
      // Sync knowledge base
      await syncKnowledgeBase(kb.knowledge_base_id);
      
      toast({
        title: 'Success',
        description: 'Knowledge base created and syncing started',
      });
      
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      toast({
        title: 'Error',
        description: 'Failed to create knowledge base. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={selectedFiles.length === 0}>
          Create Knowledge Base ({selectedFiles.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Knowledge Base</DialogTitle>
            <DialogDescription>
              Create a new knowledge base with the selected files. The files will be indexed and made searchable.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Files</Label>
              <div className="col-span-3">
                <p className="text-sm text-gray-500">{selectedFiles.length} files selected</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}