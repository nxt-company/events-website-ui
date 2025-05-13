
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { CalendarPlus, UserPlus, KeyRound, Users, CheckCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { CreateEventModal } from "@/components/modals/CreateEventModal";
import { AccessEventModal } from "@/components/modals/AccessEventModal";
import { JoinEventModal } from "@/components/modals/JoinEventModal";

export function HomePage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  return (
    <MainLayout>
      {/* Modals */}
      <CreateEventModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <AccessEventModal open={accessModalOpen} onOpenChange={setAccessModalOpen} />
      <JoinEventModal open={joinModalOpen} onOpenChange={setJoinModalOpen} />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Welcome to <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">EventQ</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl lg:text-2xl">
                Create interactive Q&A events, invite participants, and track results in real-time.
              </p>
            </motion.div>
            
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button size="lg" className="gap-2 text-lg" onClick={() => setCreateModalOpen(true)}>
                <CalendarPlus className="h-5 w-5" />
                Create Event
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-lg" onClick={() => setAccessModalOpen(true)}>
                <KeyRound className="h-5 w-5" />
                Access Event
              </Button>
              <Button size="lg" variant="secondary" className="gap-2 text-lg" onClick={() => setJoinModalOpen(true)}>
                <UserPlus className="h-5 w-5" />
                Join Event
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/40 border-y">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful Event Management</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Everything you need to create engaging Q&A sessions and manage your events efficiently
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-card p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <div className="p-3 rounded-lg bg-primary/10 text-primary inline-block mb-4">
                <CalendarPlus className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create & Manage Events</h3>
              <p className="text-muted-foreground">
                Easily create custom events, set up questions, and manage participants all in one place.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <div className="p-3 rounded-lg bg-primary/10 text-primary inline-block mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Q&A</h3>
              <p className="text-muted-foreground">
                Create multiple-choice questions with flexible options and get real-time responses from participants.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
              <div className="p-3 rounded-lg bg-primary/10 text-primary inline-block mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">User Management</h3>
              <p className="text-muted-foreground">
                Invite users with secure invite codes and track their participation and responses.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Get started with EventQ in just a few simple steps
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="flex flex-col items-center text-center p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <CalendarPlus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create an Event</h3>
              <p className="text-muted-foreground">Set up your event with a custom name and type</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Add Questions</h3>
              <p className="text-muted-foreground">Create multiple-choice questions for participants</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Invite Users</h3>
              <p className="text-muted-foreground">Send secure invite codes to participants</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">View Results</h3>
              <p className="text-muted-foreground">Track and analyze participant responses</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary/5 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <h2 className="text-3xl font-bold">Ready to Create Your Event?</h2>
            <p className="text-muted-foreground max-w-2xl">
              Get started today and experience the power of real-time Q&A sessions for your events
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2" onClick={() => setCreateModalOpen(true)}>
                <CalendarPlus className="h-5 w-5" />
                Create Event Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
