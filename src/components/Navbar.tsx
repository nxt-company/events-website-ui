import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import CreateEventModal from './CreateEventModal';
import AccessEventModal from './AccessEventModal';
import JoinEventModal from './JoinEventModal';

function Navbar() {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showAccessModal, setShowAccessModal] = React.useState(false);
  const [showJoinModal, setShowJoinModal] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isEventPage = location.pathname.startsWith('/event/');

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-14 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mr-4 flex"
          >
            <a href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Events App</span>
            </a>
          </motion.div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            {!isEventPage ? (
              <div className="flex items-center space-x-4">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Event
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="btn btn-secondary"
                  onClick={() => setShowAccessModal(true)}
                >
                  Access Event
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="btn btn-ghost"
                  onClick={() => setShowJoinModal(true)}
                >
                  Join Event
                </motion.button>
              </div>
            ) : (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="btn btn-ghost"
                onClick={() => navigate('/')}
              >
                Exit
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <Dialog
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        className="relative z-50"
      >
        <div className="modal-overlay" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="modal-content animate-slide-up">
            <CreateEventModal onClose={() => setShowCreateModal(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        className="relative z-50"
      >
        <div className="modal-overlay" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="modal-content animate-slide-up">
            <AccessEventModal onClose={() => setShowAccessModal(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        className="relative z-50"
      >
        <div className="modal-overlay" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="modal-content animate-slide-up">
            <JoinEventModal onClose={() => setShowJoinModal(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

export default Navbar;