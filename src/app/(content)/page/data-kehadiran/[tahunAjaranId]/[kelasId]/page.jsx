'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import Table from '../../../../../conponents/table/page';

import { useCreatePertemuanMutation } from '../../../../../../hooks/api/pertemuanSliceAPI';

export default function Pertemuan() {
    // modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
}
